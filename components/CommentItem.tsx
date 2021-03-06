import React, { useRef, useState, useCallback, useMemo } from 'react'
import Avatar from './AvatarWithBadge'
import { ResData as CommentInfoRes } from '../lib/network/getCommentInfoById'
import postLikeComment from '../lib/network/postLike'
import CommentSendInput from './CommentSendInput'
import styles from './styles/CommentItem.module.css'
// import Button from './Button'
import Button from '@mui/material/Button'
import Image from 'next/image' 
import Snackbar from '@mui/material/Snackbar'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTimePulgin from'dayjs/plugin/relativeTime'
import RichTextRenderer from './RichTextRenderer'

dayjs.extend(relativeTimePulgin)
dayjs.locale('zh-cn')
const ONE_DAY = 1000 * 60 * 60 * 24
/**
 * 不要用 useState、useEffect、等
 */
export default function CommentItem({
  articleId,
  commentInfo,
  topCommentId,
  hideInteract,
  onSendReply,
  toggleIdentity
}: {
  articleId: string,
  commentInfo: CommentInfoRes['comments'][0],
  topCommentId?: string,
  hideInteract?: boolean,
  onSendReply?: () => void,
  toggleIdentity?: () => void
}) {
  const [isShowReplyInput, setIsShowReplyInput] = useState(false)
  const [isShowLiked, setIsShowLiked] = useState(false)
  const [likeNumber, setLikeNumber] = useState(commentInfo?.likeNumber ?? 0)
  const [newReplyInfo, setNewReplyInfo] = useState<CommentInfoRes['comments']>([])

  const onClickReply = () => {
    setIsShowReplyInput(true)
    onSendReply?.()
  }
  const onSendReplySuccess = (newReply: CommentInfoRes['comments'][0]) => {
    setIsShowReplyInput(false)
    setNewReplyInfo(pre => [newReply, ...pre])
    onSendReply?.()
  }
  const closeReply = () => {
    setIsShowReplyInput(false)
  }
  const likeComment = useMemo(() => (
    async () => {
      if (isShowLiked) {
        return
      }
      try {
        await postLikeComment({
          commentId: commentInfo?.id
        })
        setLikeNumber(pre => pre+1)
        setIsShowLiked(true)
      } catch (err) {
        alert('点赞失败！')
      }
    }
  ), [commentInfo?.id, isShowLiked])
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
    marginLeft: commentInfo?.isReply ? '40px' : '0px',
    backgroundColor: commentInfo?.isReply ? '#f7f4fab3' : ''
  }} className={styles.body}>
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
              <Image src={'/right-arrow1.png'} width={20} height={10} alt='回复'/>
              <span className={styles.userName}>
                {
                  isReplyToGithubAccount
                  ? <a href={commentInfo?.replyTo?.replyToAccountId?.url} target='_blank' rel="noreferrer" style={{textDecoration: 'none', color: 'black'}}>
                    @{commentInfo?.replyTo?.replyToAccountId?.userName}
                  </a>
                  : `@${commentInfo?.replyTo?.replyToAccountId?.userName}`
                }
              </span>
            </div>
            }
          <div>{commentInfo?.commenter?.email}</div>
        </div>
        <div className={styles.commentContent}>
          <RichTextRenderer content={commentInfo?.content}/>
          {/* {commentInfo?.content} */}
        </div>
        <div className={styles.footer}>
          <div className={styles.time}>{
            now - commentInfo?.createTime > ONE_DAY
             ? dayjs(commentInfo?.createTime).format('YYYY-MM-DD')
             : dayjs(commentInfo?.createTime).fromNow()
          }</div>
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flex: 2
          }}>
          {
            !hideInteract && <div className={styles.like}>
              <Button
                onClick={isShowReplyInput ? closeReply : onClickReply}
                style={{fontSize: 12}}
              >
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'black'}}>
                  {
                    isShowReplyInput
                    ? '取消'
                    : <Image src={'/reply1.png'} width={15} height={15} alt='回复'/>
                  }
                  <span style={{marginLeft: '3px'}}>{commentInfo?.replyNumber + newReplyInfo.length}</span>
                </div>
              </Button>
            </div>
          }
          {
            !hideInteract && 
            <div className={styles.like}>
              <Button
                onClick={likeComment}
                style={{fontSize: 12}}
              >
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  {
                    <Image src='/good.png' alt='赞' width='15' height='15'/>
                  }
                  <span style={{marginLeft: '3px', color: isShowLiked ? 'red' : '#aaa'}}>{likeNumber}</span>
                </div>
              </Button>
            </div>
          }
          </div>
        </div>
        {
          isShowReplyInput &&
          <div style={{marginTop: '10px', marginLeft: '40px'}}>
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
              toggleIdentity={toggleIdentity}
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
          />)
        }
      </div>
    }
  </div>
}




