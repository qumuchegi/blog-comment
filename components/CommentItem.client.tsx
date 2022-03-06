import React, { Suspense, useRef, useState } from 'react'
import Avatar from './avatar'
import { ResData as CommentInfoRes } from '../lib/network/getCommentInfoById'
import postLikeComment from '../lib/network/postLike'
import CommentSendInput from './CommentSendInput.client'
import styles from './styles/CommentItem.module.css'
// import Button from './Button'
import Button from '@mui/material/Button'
import Image from 'next/image' 
import Snackbar from '@mui/material/Snackbar'

/**
 * 不要用 useState、useEffect、等
 */
export default function CommentItem({
  articleId,
  commentInfo,
  topCommentId,
  hideInteract
}: {
  articleId: string,
  commentInfo: CommentInfoRes['comments'][0],
  topCommentId?: string,
  hideInteract?: boolean
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
  const likeComment = async () => {
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
  return <div style={{
    marginLeft: commentInfo?.isReply ? '40px' : '0px',
    borderLeft: commentInfo?.isReply ? 'solid 1px #bbb' : '',
    marginBottom: '0px'
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
          <Avatar avatarUrl={commentInfo?.commenter?.avatar}/>
          <div>{commentInfo?.commenter?.userName}</div>
          {
            commentInfo?.replyTo &&
            <div>
              <Image src={'/right-arrow.png'} width={20} height={10} alt='回复'/>
              <span className={styles.userName}>@{commentInfo?.replyTo?.replyToAccountId?.userName}</span>
            </div>
            }
          <div>{commentInfo?.commenter?.email}</div>
        </div>
        <div className={styles.commentContent}>{commentInfo?.content}</div>
        <div className={styles.footer}>
          <div className={styles.time}>{new Date(commentInfo?.createTime).toLocaleString()}</div>
          {
            !hideInteract && <div className={styles.like}>
              <Button
                onClick={isShowReplyInput ? closeReply : onClickReply}
                // height={30}
              >
                {
                  isShowReplyInput
                  ? '取消'
                  : <Image src={'/reply.png'} width={20} height={20} alt='回复'/>
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
                  <Image src='/good.png' alt='赞' width='20' height='20'/>
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




