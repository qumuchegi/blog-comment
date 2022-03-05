import React, { useCallback, useState } from 'react'
import postComment from '../lib/network/postComment'
import postReply, { Params as PostReplyParams } from '../lib/network/postReply'

interface Props {
  articleId: string
  inputStyle?: React.StyleHTMLAttributes<'html'>
  onSuccess?: () => void,
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
  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setValue(e.target.value)
  }, [])
  const _onSend = useCallback(async () => {
    if (!articleId) return
    let params = {
      clusterId: articleId,
      content: value,
      // TODO: 暂时用匿名账号发送评论
      commenter: {
        userName: 'Anonymous',
        avatar: '',
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
      onSuccess?.()
    } catch (err) {
      onFailed?.()
    }
  }, [articleId, onFailed, onSuccess, replyTo, value])
  return <div>
    <div>
      <input
        style={{
          flex: '1',
          color: 'black',
          padding: '10px'
        }}
        type='text'
        placeholder={replyTo ? `回复 ${replyTo.toAccountName}` : '评论～'}
        onChange={onInputChange}
      />
    </div>
    <div>
      <div onClick={_onSend}>发送</div>
    </div>
  </div>
}
