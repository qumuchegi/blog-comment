import React, { useRef, useState, useCallback, useMemo } from 'react'
import Avatar from './Avatar'
import { ResData as CommentInfoRes } from '../lib/network/getCommentInfoById'
import postLikeComment from '../lib/network/postLike'
import CommentSendInput from './CommentSendInput'
import styles from './styles/CommentItem.module.css'
// import Button from './Button'
import Button from '@mui/material/Button'
import Image from 'next/image' 
import Snackbar from '@mui/material/Snackbar'
import dayjs from 'dayjs'
import relativeTimePulgin from'dayjs/plugin/relativeTime'

dayjs.extend(relativeTimePulgin)
const ONE_DAY = 1000 * 60 * 60 * 24
/**
 * 不要用 useState、useEffect、等
 */
export default function CommentItem({
  articleId,
  commentInfo,
  topCommentId,
  hideInteract,
  beforeInteract
}: {
  articleId: string,
  commentInfo: CommentInfoRes['comments'][0],
  topCommentId?: string,
  hideInteract?: boolean,
  beforeInteract: <T>(hadLoginCallback: T) => T
}) {
  const [isShowReplyInput, setIsShowReplyInput] = useState(false)
  const [isShowLikedWarn, setIsShowLikedWarn] = useState(false)
  const [likeNumber, setLikeNumber] = useState(commentInfo?.likeNumber ?? 0)
  const [newReplyInfo, setNewReplyInfo] = useState<CommentInfoRes['comments']>([])
  const isLiked = useRef(false)
  const onClickReply = () => {
    setIsShowReplyInput(true)
  }
  const onSendReplySuccess = (newReply: CommentInfoRes['comments'][0]) => {
    setIsShowReplyInput(false)
    setNewReplyInfo(pre => [newReply, ...pre])
  }
  const closeReply = () => {
    setIsShowReplyInput(false)
  }
  const likeComment = useMemo(() => beforeInteract((
    async () => {
      if (isLiked.current) {
        setIsShowLikedWarn(true)
        setTimeout(() => {
          setIsShowLikedWarn(false)
        }, 2000)
        return
      }
      try {
        await postLikeComment({
          commentId: commentInfo?.id
        })
        setLikeNumber(pre => pre+1)
        isLiked.current = true
      } catch (err) {
        alert('点赞失败！')
      }
    }
  )), [beforeInteract, commentInfo?.id])
  const isCommenterGithubAccount = useMemo(() => {
    return commentInfo?.commenter?.accountType === 1
  }, [commentInfo])
  const isReplyToGithubAccount = useMemo(() => {
    return commentInfo?.replyTo?.replyToAccountId?.accountType === 1
  }, [commentInfo])
  const now = new Date().getTime()
  const onClickCommenterAvatar = useCallback(() => {
    if (isCommenterGithubAccount) {
      window.open(commentInfo?.commenter?.url)
    }
  }, [commentInfo?.commenter?.url, isCommenterGithubAccount])
  return <div style={{
    paddingLeft: commentInfo?.isReply ? '40px' : '0px',
    // borderLeft: commentInfo?.isReply ? 'solid 1px #bbb' : undefined,
    // marginBottom: '0px'
  }} className={styles.body}>
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={isShowLikedWarn}
      // onClose={handleClose}
      message="你已经赞过了"
      // key={vertical + horizontal}
    />
    {
      commentInfo
      && <div>
        <div className={styles.header}>
          <Avatar
            avatarUrl={commentInfo?.commenter?.avatar}
            onClick={onClickCommenterAvatar}
            badgeImgUrl={isCommenterGithubAccount ? '/github.png' : ''}
            />
          <div className={styles.userName} onClick={onClickCommenterAvatar}>{commentInfo?.commenter?.userName}</div>
          {
            commentInfo?.replyTo &&
            <div>
              <Image src={'/right-arrow.png'} width={20} height={10} alt='回复'/>
              <span className={styles.userName}>
                {
                  isReplyToGithubAccount
                  ? <a href={commentInfo?.replyTo?.replyToAccountId?.url} target='_blank' rel="noreferrer">
                    @{commentInfo?.replyTo?.replyToAccountId?.userName}
                  </a>
                  : `@${commentInfo?.replyTo?.replyToAccountId?.userName}`
                }
              </span>
            </div>
            }
          <div>{commentInfo?.commenter?.email}</div>
        </div>
        <div className={styles.commentContent}>{commentInfo?.content}</div>
        <div className={styles.footer}>
          <div className={styles.time}>{
            now - commentInfo?.createTime > ONE_DAY
             ? dayjs(commentInfo?.createTime).format('YYYY/MM/DD/')
             : dayjs(commentInfo?.createTime).fromNow()
          }</div>
          {
            !hideInteract && <div className={styles.like}>
              <Button
                onClick={isShowReplyInput ? closeReply : onClickReply}
                // height={30}
              >
                {
                  isShowReplyInput
                  ? '取消'
                  : <Image src={'/reply.png'} width={15} height={15} alt='回复'/>
                }
              </Button>
              <span>{commentInfo?.replyNumber}</span>
            </div>
          }
          {
            !hideInteract && 
            <div className={styles.like}>
              <Button
                onClick={likeComment}
              >
                {
                  <Image src='/good.png' alt='赞' width='15' height='15'/>
                }
              </Button>
              <span>{likeNumber}</span>
            </div>
          }
        </div>
        {
          isShowReplyInput &&
          <div style={{marginTop: '10px'}}>
            <hr/>
            <CommentSendInput
              articleId={articleId}
              replyTo={{
                toAccountId: commentInfo.commenter.accountId,
                toAccountAvatar: commentInfo.commenter.avatar,
                toAccountName: commentInfo.commenter.userName,
                toCommentId: commentInfo.id,
                topCommentId: topCommentId
              }}
              onSuccess={onSendReplySuccess}
              beforeInteract={beforeInteract}
            /> 
          </div>
        }
      </div>
    }
    {
      newReplyInfo
      && <div className={styles.newReply}>
        {
          newReplyInfo.map(item => <CommentItem
            key={item.id}
            commentInfo={item}
            articleId={articleId}
            hideInteract={true}
            beforeInteract={beforeInteract}
          />)
        }
      </div>
    }
  </div>
}




