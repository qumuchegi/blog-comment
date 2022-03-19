import React, { useCallback, useState, useMemo, useEffect } from 'react'
import postComment from '../lib/network/postComment'
import postReply, { Params as PostReplyParams } from '../lib/network/postReply'
import Button from '@mui/material/Button'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import styles from './styles/CommentSendInput.module.css'
import CommentItem from './CommentItem'
import { ResData as CommentInfoRes } from '../lib/network/getCommentInfoById'
import TextField from '@mui/material/TextField'
import Avatar from './Avatar'
import { useStoreState } from './store'
import { AuthPlatform } from './LoginDialog'

interface Props {
  articleId: string
  inputStyle?: React.StyleHTMLAttributes<'html'>
  beforeInteract: <T>(hadLoginCallback: T) => T
  onSuccess?: (newComment: CommentInfoRes['comments'][0]) => void,
  onFailed?: () => void
  replyTo?: {
    toAccountId: string,
    toAccountAvatar: string,
    toAccountName: string,
    toCommentId: string,
    topCommentId?: string // 回复的回复的时候，带上顶级评论的 ID
  }
  toggleIdentity?: () => void
}
export default function CommentSendInput({
  articleId,
  inputStyle = {},
  beforeInteract,
  onSuccess,
  onFailed,
  replyTo,
  toggleIdentity
}: Props) {
  const [value, setValue] = useState('')
  const [isSendEmptyValue, setIsSendEmptyValue] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [newCommentInfo, setNewCommentInfo] = useState<CommentInfoRes['comments']>([])
  const onInputChange: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
    setValue(e.target.value)
  }, [])
  const [currentLoginIdentity, maybeLoginedGithubInfo] = useStoreState(state => [
    state.currentLoginIdentity,
    state.githubAuthInfo
  ])
  const _onSend = useMemo(() => beforeInteract((async () => {
    if (!articleId || !value) {
      setIsSendEmptyValue(true)
      setTimeout(() => {
        setIsSendEmptyValue(false)
      }, 2000)
      return
    }
    
    let commenter
    if (
      currentLoginIdentity === AuthPlatform.github
      && maybeLoginedGithubInfo
    ) {
      commenter = {
        id: maybeLoginedGithubInfo.userId,
        userName: maybeLoginedGithubInfo.username,
        avatar: maybeLoginedGithubInfo.avatar,
        email: '',
        url: maybeLoginedGithubInfo.userHomeUrl
      }
    } else {
      commenter = {
        id: '',
        userName: 'Anonymous',
        avatar: '/anonymous_avatar.png',
        email: '',
        url: ''
      }
    }
    let params = {
      clusterId: articleId,
      content: value,
      commenter
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
      setNewCommentInfo(pre => [res.newComment, ...pre])
      onSuccess?.(res.newComment)
      setValue('')
    } catch (err) {
      onFailed?.()
    }
    setIsSending(false)
  })), [articleId, beforeInteract, currentLoginIdentity, maybeLoginedGithubInfo, onFailed, onSuccess, replyTo, value])

  const toggleLoginIdentity = useCallback(() => {
    toggleIdentity?.()
  }, [toggleIdentity])

  return <div>
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isSending}
      // onClick={handleClose}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
    <div className={styles.container}>
      <div style={{marginRight: 20, marginLeft: 5}}>
        <Avatar
          avatarUrl={currentLoginIdentity === AuthPlatform.github ? maybeLoginedGithubInfo?.avatar : '/anonymous_avatar.png'}
          onClick={toggleLoginIdentity}
          badgeImgUrl={'/double-arrow.png'}
          />
      </div>
      <TextField
        fullWidth
        // color='warning'
        variant="standard"
        color={'primary'}
        label={replyTo ? `回复 @${replyTo.toAccountName}` : '输入评论 ...'}
        id="fullWidth"
        value={value}
        onChange={onInputChange}
        multiline
        style={{backgroundColor: isSendEmptyValue ? 'rgba(235, 173, 173, 0.2)' : '#fff'}}
      />
      {/* <div> */}
       <Button onClick={_onSend} style={{height: '100%', color: 'black'}}>
          发送
        </Button>
      {/* </div> */}
    </div>
    {
        newCommentInfo.map(
          info => <div className={styles.newComment} key={info.id}>
          <CommentItem
            commentInfo={info}
            articleId={articleId}
            hideInteract={true}
            beforeInteract={beforeInteract}
          />
        </div>
        )
      }
  </div>
}
