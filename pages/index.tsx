import CommentSendInput from '../components/CommentSendInput'
import CommentList from '../components/CommentList'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GetServerSideProps } from 'next'
import LoginDialog, { LoginIdentity, AuthPlatform } from '../components/LoginDialog'
import StoreProvider, { useStoreAction } from '../components/store'
import { entriesToObj } from '../lib/utils/object'
import { BroadcastChannel } from 'broadcast-channel'

const ANONYMOUS_ACCOUNT = {
  userId: '',
  authPlatform: AuthPlatform.anonymous,
  userName: '匿名',
  avatar: '/anonymous_avatar.png'
}
const Home = ({
  articleId,
  auth = [AuthPlatform.anonymous],
  githubAuthClientId,
  parentHref
}: {
  articleId: string,
  auth: AuthPlatform[], // ['github', 'anonymous']
  githubAuthClientId?: string,
  parentHref: string
}) => {
  const [openLoginDialog, setOpenLoginDialog] = useState(true)
  const [loginIdentity, setLoginIdentity] = useState<LoginIdentity>()
  const setGithubAuthInfo = useStoreAction(actions => actions.setGithubAuthInfo)
  const clusterId = articleId || '4edd40c86762e0fb12000003'
  const onLoginSuccess = useCallback((authType) => {
    if (authType === AuthPlatform.anonymous) {
      setLoginIdentity(ANONYMOUS_ACCOUNT)
      setGithubAuthInfo(undefined)
    } else {
      // setLoginIdentity({
      //   userId: '',
      //   authPlatform: AuthPlatform.anonymous,
      //   userName: '匿名',
      //   avatar: '/anonymous_avatar.png'
      // })
    }
  } ,[setGithubAuthInfo])
  const onLoginFailed = useCallback(() => {
    setLoginIdentity(ANONYMOUS_ACCOUNT)
  } ,[])

  const ensureLogin = useCallback((loginedCallback: any) => {
      // sendHeight()
      if (!loginIdentity) {
        return () => {
          setOpenLoginDialog(true)
        }
      }
      return loginedCallback
  }, [loginIdentity])

  useEffect(() => {
    const INIT_IFRAME_MSG = 'iframe_init_msg'
    window.parent?.postMessage(
      JSON.stringify({
        msg: INIT_IFRAME_MSG,
        data: {
          githubAuthClientId: githubAuthClientId
        }
      }),
      "*"
    )
  }, [githubAuthClientId])

  useEffect(() => {
    // BroadcastChannel 借助 local Storage 存储的登陆信息
    const localStorageValue = localStorage.getItem('pubkey.broadcastChannel-github-auth-message')

    let githubAuthCookieValue = ''
    try {
      githubAuthCookieValue = JSON.parse(localStorageValue || '{}').data.data
    } catch (err) {
      githubAuthCookieValue = ''
    }
    console.log('githubAuthCookieValue', githubAuthCookieValue)
    const githubAuth = entriesToObj<{
      userHomeUrl: string,
      auth_username: string,
      auth_avatar: string,
      // auth_token,
      github_userid: string
      // 不知道为什么在移动端浏览器，登陆后 cookie 是空的，
    }>(/*document.cookie*/githubAuthCookieValue, ';', (v) => window.decodeURIComponent(v))
    if (githubAuth?.userHomeUrl) {
      const {
        userHomeUrl,
        auth_username,
        auth_avatar,
        // auth_token,
        github_userid
      } = githubAuth
      setOpenLoginDialog(false)
      const _loginIdentity = {
        userId: github_userid,
        authPlatform: AuthPlatform.github,
        userName: auth_username,
        avatar: auth_avatar,
        url: userHomeUrl,
        // token: auth_token
      }
      setLoginIdentity(_loginIdentity)
      setGithubAuthInfo(
        {
          userId: github_userid,
          username: auth_username,
          avatar: window.decodeURIComponent(auth_avatar),
          userHomeUrl: window.decodeURIComponent(userHomeUrl),
          // token: auth_token
        }
      )
    } else {
      
    }
  }, [setGithubAuthInfo])

  const sendHeight = useCallback(() => {
    window.parent?.postMessage(
      JSON.stringify({
        msg: 'send_iframe_height',
        data: {
          height: document.getElementById('commentBodyId')?.scrollHeight
        }
      }),
      "*"
    )
  }, [])

  const showLoginDialog = useCallback(() => {
    setOpenLoginDialog(true)
  }, [])

  useEffect(() => {
    // 建立和 newWin 的通信频道
    const channel = new BroadcastChannel('github-auth-message', {
      type: 'localstorage',
      webWorkerSupport: true
    })
    channel.addEventListener('message', evt => {
      window.location.reload()
    })
  }, [])

  return (
    <div
      id='commentBodyId'
      style={{
        flex: 1
      }}>
        <LoginDialog
          openLoginDialog={openLoginDialog}
          onRequestCLose={useCallback(() => {
            setOpenLoginDialog(false)
          }, [])}
          onLoginSuccess={onLoginSuccess}
          onLoginFailed={onLoginFailed}
          auth={auth}
          githubAuthClientId={githubAuthClientId}
          parentHref={parentHref}
        />
      <div style={{
        backgroundColor: '#fff',
        padding: '10px 10px 0 10px',
        flexGrow: 1
      }}>
        <CommentSendInput
          articleId={clusterId}
          beforeInteract={ensureLogin}
          toggleIdentity={showLoginDialog}
          onSuccess={sendHeight}
        /> 
      </div>
      <div style={{
        padding: '10px'
      }}>
        <CommentList
          clusterId={clusterId}
          beforeInteract={ensureLogin}
          onDataLoadSuccess={sendHeight}
          toggleIdentity={showLoginDialog}
        />
      </div>
    </div>
  )
}

const ConnectStore = (
  {
    articleId,
    auth,
    githubAuthClientId,
    parentHref
  }: {
    articleId: string
    auth: AuthPlatform[],
    githubAuthClientId?: string,
    parentHref: string
  }
) => {
  return <StoreProvider>
    <Home articleId={articleId} auth={auth} githubAuthClientId={githubAuthClientId} parentHref={parentHref}/>
  </StoreProvider>
}
export default ConnectStore

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { articleId = '', auth = [], parentHref } = context.query || {}

  return {
    props: {
      articleId,
      auth,
      githubAuthClientId: process.env.github_auth_clientid,
      parentHref
    }
  }
}
