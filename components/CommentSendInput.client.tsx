import React, { useCallback, useState } from 'react'
import postComment from '../lib/network/postComment'
import postReply, { Params as PostReplyParams } from '../lib/network/postReply'
// import Button from './Button'
import Button from '@mui/material/Button'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import styles from './styles/CommentSendInput.module.css'
import Image from 'next/image' 
import CommentItem from './CommentItem.client'
import { ResData as CommentInfoRes } from '../lib/network/getCommentInfoById'
import TextField from '@mui/material/TextField'
import Snackbar from '@mui/material/Snackbar'

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
  const [isSendEmptyValue, setIsSendEmptyValue] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [newCommentInfo, setNewCommentInfo] = useState<CommentInfoRes['comments'][0]>()
  const onInputChange: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
    setValue(e.target.value)
  }, [])
  const _onSend = useCallback(async () => {
    if (!articleId || !value) {
      setIsSendEmptyValue(true)
      setTimeout(() => {
      setIsSendEmptyValue(false)
      }, 2000)
      return
    }
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
      setIsSending(true)
      //@ts-ignore
      const res = await request(params)
      setNewCommentInfo(res.newComment)
      onSuccess?.(res.newComment)
      setValue('')
    } catch (err) {
      onFailed?.()
    }
    setIsSending(false)
  }, [articleId, onFailed, onSuccess, replyTo, value])
  return <div>
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isSending}
      // onClick={handleClose}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={isSendEmptyValue}
      // onClose={handleClose}
      message="请输入消息"
      // key={vertical + horizontal}
    />
    <div className={styles.container}>
      <TextField
        fullWidth
        label={replyTo ? `回复 @${replyTo.toAccountName}` : '评论'}
        id="fullWidth"
        value={value}
        onChange={onInputChange}
        multiline
        color="secondary"
      />
      {/* <textarea
        style={{
          flex: 1,
          borderRadius: '5px',
          color: 'black',
          padding: '10px',
          height: '70px'
        }}
        value={value}
        placeholder={replyTo ? `回复 @${replyTo.toAccountName}` : '评论～'}
        onChange={onInputChange}
      /> */}
      <div style={{flexGrow: 0}}>
       <Button onClick={_onSend} style={{flex:1}} color="secondary">
          发送
        </Button>
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
