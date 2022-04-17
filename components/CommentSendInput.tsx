import React, { useCallback, useState, useMemo, useEffect } from 'react'
import postComment from '../lib/network/postComment'
import postReply, { Params as PostReplyParams } from '../lib/network/postReply'
import Button from '@mui/material/Button'
import LoadingMask from './LoaingMask'
import styles from './styles/CommentSendInput.module.css'
import CommentItem from './CommentItem'
import { ResData as CommentInfoRes } from '../lib/network/getCommentInfoById'
import RichTextInput from './RichTextInput'
import Avatar from './AvatarWithBadge'
import { useStoreAction, useStoreState } from './store'
import LoginDialog, { AuthPlatform } from './LoginDialog'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'

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
  toggleIdentity?: () => void
}
export default function CommentSendInput({
  articleId,
  inputStyle = {},
  onSuccess,
  onFailed,
  replyTo,
  toggleIdentity
}: Props) {
  const [value, setValue] = useState<{
    text: string
    html: string
  }>({
    text: '',
    html: ''
  })
  const [isSending, setIsSending] = useState(false)
  const [newCommentInfo, setNewCommentInfo] = useState<CommentInfoRes['comments']>([])
  const onInputChange = useCallback((textValue, htmlValue) => {
    setValue({
      text: textValue,
      html: htmlValue
    })
  }, [])
  const [
    currentLoginIdentity,
    maybeLoginedGithubInfo,
    authConfig,
    githubAuthClientId,
    parentHref
  ] = useStoreState(state => [
    state.currentLoginIdentity,
    state.githubAuthInfo,
    state.authConfig,
    state.githubAuthClientId,
    state.parentHref
  ])
  const isValidIdentity = useMemo(() => {
    return authConfig.includes(currentLoginIdentity)
  }, [authConfig, currentLoginIdentity])
  const [loginWarn, setLoginWarn] = useState(false)

  const _onSend = useMemo(() => (async () => {
    if (!isValidIdentity) { // 还没登陆
      console.log({
        authConfig,
        currentLoginIdentity
      })
      setLoginWarn(true)
      return
    }
    if (!articleId || !value.text) {
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
      content: value.html,
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
      setValue({
        text: '',
        html: ''
      })
    } catch (err) {
      onFailed?.()
    }
    setIsSending(false)
  }), [articleId, authConfig, currentLoginIdentity, isValidIdentity, maybeLoginedGithubInfo, onFailed, onSuccess, replyTo, value.html, value.text])

  const toggleLoginIdentity = useCallback(() => {
    toggleIdentity?.()
  }, [toggleIdentity])

  return <div>
    <LoadingMask isShow={isSending}/>
    <div>
      <RichTextInput
        placeholder={replyTo ? `回复 <span style="color: 'blue'">@${replyTo.toAccountName}</span>` : '输入评论 ...'}
        inputStyle={`border: solid 1px #eee; padding: 5px`}
        value={value.text}
        onChange={onInputChange}
      />
      <div className={styles.container}>
        <Tooltip open={loginWarn} title='请先登陆' arrow>
          <div style={{marginRight: 20, marginLeft: 5}}>
            <LoginDialog>
              <Avatar
                avatarUrl={currentLoginIdentity === AuthPlatform.github ? maybeLoginedGithubInfo?.avatar : '/anonymous_avatar.png'}
                badgeImgUrl={'/double-arrow.png'}
                />
            </LoginDialog>
          </div>
        </Tooltip>
        <Button
          onClick={_onSend}
          variant='contained'
          style={{height: '100%', color: !value.text ? '#aaa': 'white'}}
          disabled={!value.text}
        >
          发送
        </Button>
        <div style={{fontSize: '0.5rem', color: '#aaa', marginLeft: '10px'}}>
          {
            replyTo
            ? <span>回复 <span style={{fontWeight: 'bold'}}>@{replyTo.toAccountName}</span></span>
            : ''
          }
        </div>
      </div>
    </div>
    {
        newCommentInfo.map(
          info => <div className={styles.newComment} key={info.id}>
          <CommentItem
            commentInfo={info}
            articleId={articleId}
            hideInteract={true}
          />
        </div>
        )
      }
  </div>
}
