import React, { Suspense, useRef, useState } from 'react'
import Avatar from './avatar'
import { ResData as CommentInfoRes } from '../lib/network/getCommentInfoById'
import postLikeComment from '../lib/network/postLike'
import CommentSendInput from './CommentSendInput.client'
import styles from './styles/CommentItem.module.css'
import Button from './Button'
import Image from 'next/image' 

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
    if (isLiked.current) return alert('你已经赞过了')
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
    paddingLeft: commentInfo?.isReply ? '30px' : '0px',
    marginBottom: '10px'
  }} className={styles.body}>
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
            !hideInteract &&
            <Button
              onClick={isShowReplyInput ? closeReply : onClickReply}
              text={
                isShowReplyInput
                ? '取消回复'
                : <Image src={'/reply.png'} width={20} height={20} alt='回复'/>
              }
              width={100}
              height={30}
            />
          }
          {
            !hideInteract && 
            <div className={styles.like}>
              <Button
                onClick={likeComment}
                text={
                  <Image src='/good.png' alt='赞' width='20' height='20'/>
                }
              />
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




