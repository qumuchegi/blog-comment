import CommentSendInput from '../components/CommentSendInput'
import dynamic from 'next/dynamic'
import CommentList from '../components/CommentList'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GetServerSideProps } from 'next'
import LoginDialog, { LoginIdentity, AuthPlatform } from '../components/LoginDialog'
import { entriesToObj } from '../lib/utils/object'
import { cacheGithubAuthInfo } from '../lib/login/github'

const Home = ({
  articleId
}: {
  articleId: string
}) => {
  const [openLoginDialog, setOpenLoginDialog] = useState(true)
  const [loginIdentity, setLoginIdentity] = useState<LoginIdentity>()

  const clusterId = articleId || '4edd40c86762e0fb12000003'
  const onLoginSuccess = useCallback((authType) => {
    if (authType === AuthPlatform.anonymous) {
      setLoginIdentity({
        userId: '',
        authPlatform: AuthPlatform.anonymous,
        userName: '匿名',
        avatar: '/anonymous_avatar.png'
      })
    } else {
      setLoginIdentity({
        userId: '',
        authPlatform: AuthPlatform.anonymous,
        userName: '匿名',
        avatar: '/anonymous_avatar.png'
      })
    }
  } ,[])
  const onLoginFailed = useCallback(() => {
    setLoginIdentity({
      userId: '',
      authPlatform: AuthPlatform.anonymous,
      userName: '匿名',
      avatar: '/anonymous_avatar.png'
    })
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
        msg: INIT_IFRAME_MSG
      }),
      "*"
    )
  }, [])

  useEffect(() => {
    window.addEventListener('message', (evt) => {
      try{
        const data = JSON.parse(evt.data)
        if ((data.msg === 'forward-github-auth-info')) {
          const {
            userHomeUrl,
            auth_username,
            auth_avatar,
            auth_token,
            github_userid
          } = data.data
          if (
            userHomeUrl
            && auth_username
            && auth_avatar
            && auth_token
            && github_userid
          ) {
            const _loginIdentity = {
              userId: github_userid,
              authPlatform: AuthPlatform.github,
              userName: auth_username,
              avatar: auth_avatar,
              url: userHomeUrl,
              token: auth_token
            }
            setLoginIdentity(_loginIdentity)
            cacheGithubAuthInfo({
              userId: github_userid,
              username: auth_username,
              avatar: auth_avatar,
              userHomeUrl: userHomeUrl,
              token: auth_token
            })
          } else {
          }
        }
      } catch (err) {

      }
    }, false)

  }, [])

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

  return (<div
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
      />
    <div style={{
      backgroundColor: '#fff',
      padding: '10px 10px 0 10px',
      flexGrow: 1,
      height: openLoginDialog ? '0px' : ''
    }}>
      <CommentSendInput
        articleId={clusterId}
        beforeInteract={ensureLogin}
        onSuccess={sendHeight}
      /> 
    </div>
    <div style={{
      padding: '10px',
      height: openLoginDialog ? '0px' : ''
    }}>
      <CommentList
        clusterId={clusterId}
        offset={0}
        beforeInteract={ensureLogin}
        onDataLoadSuccess={sendHeight}
      />
    </div>
  </div>)
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { articleId } = context.query || {}

  return {
    props: {
      articleId
    }
  }
}
