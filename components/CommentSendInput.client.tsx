import React, { useCallback, useState } from 'react'
import postComment from '../lib/network/postComment'
import postReply, { Params as PostReplyParams } from '../lib/network/postReply'
import Button from './Button'
import styles from './styles/CommentSendInput.module.css'
import Image from 'next/image' 
import CommentItem from './CommentItem.client'
import { ResData as CommentInfoRes } from '../lib/network/getCommentInfoById'

interface Props {
  articleId: string
  inputStyle?: React.StyleHTMLAttributes<'html'>
  onSuccess?: (newComment: CommentInfoRes['comments'][0]) => void,
  onFailed?: () => void
  replyTo?: {
    toAccountId: string,
    toAccountAvatar: string,
    toAccountName: string,
    toCommentId: string,
    topCommentId?: string // 回复的回复的时候，带上顶级评论的 ID
  }
}
export default function CommentSendInput({
  articleId,
  inputStyle = {},
  onSuccess,
  onFailed,
  replyTo
}: Props) {
  const [value, setValue] = useState('')
  const [newCommentInfo, setNewCommentInfo] = useState<CommentInfoRes['comments'][0]>()
  const onInputChange: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
    setValue(e.target.value)
  }, [])
  const _onSend = useCallback(async () => {
    if (!articleId || !value) return
    let params = {
      clusterId: articleId,
      content: value,
      // TODO: 暂时用匿名账号发送评论
      commenter: {
        userName: 'Anonymous',
        avatar: '/anonymous_avatar.png',
        email: '',
        url: ''
      }
    }
    let request
    if (replyTo) {
      params = {
        ...params,
        replyTo: {
          replyToCommentId: replyTo.toCommentId,
          replyToAccountId: replyTo.toAccountId,
          topCommentId: replyTo.topCommentId
        }
      } as PostReplyParams
      request = postReply
    } else {
      request = postComment
    }
    try {
      //@ts-ignore
      const res = await request(params)
      setNewCommentInfo(res.newComment)
      onSuccess?.(res.newComment)
    } catch (err) {
      onFailed?.()
    }
  }, [articleId, onFailed, onSuccess, replyTo, value])
  return <div>
    <div className={styles.container}>
      <textarea
        style={{
          flex: 1,
          borderRadius: '5px',
          color: 'black',
          padding: '10px',
          height: '70px'
        }}
        placeholder={replyTo ? `回复 @${replyTo.toAccountName}` : '评论～'}
        onChange={onInputChange}
      />
      <div style={{flexGrow: 0}}>
        <Button onClick={_onSend} text='发送' width={50} height={70}/>
      </div>
    </div>
    {
        newCommentInfo
        && <div className={styles.newComment}>
          <CommentItem
            commentInfo={newCommentInfo}
            articleId={articleId}
            hideInteract={true}
          />
        </div>
      }
  </div>
}
