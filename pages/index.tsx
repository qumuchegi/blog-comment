import CommentSendInput from '../components/CommentSendInput'
import CommentList from '../components/CommentList'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GetServerSideProps } from 'next'
import LoginDialog, { LoginIdentity, AuthPlatform } from '../components/LoginDialog'
import StoreProvider, { useStoreAction } from '../lib/store'
import { entriesToObj } from '../lib/utils/object'
import { MESSAGE } from '../lib/const'

const Home = ({
  articleId
}: {
  articleId: string
}) => {
  const setGithubAuthInfo = useStoreAction(actions => actions.setGithubAuthInfo)
  const clusterId = articleId || '4edd40c86762e0fb12000003'

  useEffect(() => {
    window.parent?.postMessage(
      JSON.stringify({
        msg: MESSAGE.INIT_IFRAME_MSG,
        data: {
          // githubAuthClientId: githubAuthClientId
        }
      }),
      "*"
    )
  }, [])

  useEffect(() => {
    console.log({
      cookie: document.cookie
    })
    let githubAuthCookieValue = ''
    try {
      githubAuthCookieValue = document.cookie
    } catch (err) {
      githubAuthCookieValue = ''
    }
    // console.log('githubAuthCookieValue', githubAuthCookieValue)
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
        msg: MESSAGE.SEND_IFRAME_HEIGHT,
        data: {
          height: document.getElementById('commentBodyId')?.scrollHeight
        }
      }),
      "*"
    )
  }, [])

  useEffect(() => {
    const observer = new MutationObserver(() => {
      sendHeight()
    })
  
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    })
    return () => {
      observer.disconnect()
    }
  }, [sendHeight])

  return (
    <div
      id='commentBodyId'
      style={{
        flex: 1
      }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '10px 10px 0 10px',
        flexGrow: 1
      }}>
        <CommentSendInput
          articleId={clusterId}
        /> 
      </div>
      <div style={{
        padding: '10px'
      }}>
        <CommentList
          clusterId={clusterId}
        />
      </div>
    </div>
  )
}

const ConnectStore = (
  {
    articleId,
    auth = [AuthPlatform.anonymous, AuthPlatform.github],
    githubAuthClientId,
    parentHref
  }: {
    articleId: string
    auth: AuthPlatform[],
    githubAuthClientId?: string,
    parentHref: string
  }
) => {
  return <StoreProvider
    authConfig={auth}
    githubAuthClientId={githubAuthClientId}
    parentHref={parentHref}
  >
    <Home articleId={articleId}/>
  </StoreProvider>
}
export default ConnectStore

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { articleId = '', auth = [AuthPlatform.anonymous, AuthPlatform.github], parentHref  = '' } = context.query || {}

  return {
    props: {
      articleId,
      auth,
      githubAuthClientId: process.env.github_auth_clientid,
      parentHref
    }
  }
}
