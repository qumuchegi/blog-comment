import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import openGithubAuth from './login/github'
import { GithubAuth } from '../types/context'
import { AuthPlatform } from '../components/LoginDialog'

type ContextValue = {
  state: {
    authConfig: AuthPlatform[],
    githubAuthClientId?: string,
    parentHref?: string,
    currentLoginIdentity: AuthPlatform,
    githubAuthInfo?: GithubAuth
  }
  actions: {
    toggleLoginIdentity: (LoginIdentity: AuthPlatform) => void,
    setGithubAuthInfo: (githubAuthInfo: GithubAuth) => void,
    startLogin: (
      selectLoginIdentity: AuthPlatform,
      onSucc?: () => void,
      onFail?: () => void
    ) => void
  }
}
const DEFAULT_CTX_VALUE: ContextValue = {
  state: {
    authConfig: [AuthPlatform.anonymous, AuthPlatform.github],
    currentLoginIdentity: AuthPlatform.anonymous,
    githubAuthInfo: undefined
  },
  actions: {
    toggleLoginIdentity: (LoginIdentity: AuthPlatform) => {},
    setGithubAuthInfo: (githubAuthInfo: GithubAuth) => {},
    startLogin: (selectLoginIdentity: AuthPlatform) => {}
  }
}
const GlobalContext = createContext<ContextValue>(DEFAULT_CTX_VALUE)

export const useStoreState = (getter: (state: ContextValue['state']) => any) => getter(useContext(GlobalContext).state)

export const useStoreAction = (getter: (actions: ContextValue['actions']) => any) => getter(useContext(GlobalContext).actions)

const StoreProvider: React.FC<{
  authConfig: AuthPlatform[],
  githubAuthClientId?: string,
  parentHref?: string,
  children: React.ReactChild
}> = ({
  authConfig,
  githubAuthClientId,
  parentHref,
  children
}) => {
  const [value, setValue] = useState<ContextValue>({
    ...DEFAULT_CTX_VALUE,
    state: {
      ...DEFAULT_CTX_VALUE.state,
      authConfig,
      githubAuthClientId,
      parentHref
    }
  })

  const setGithubAuthInfo = useCallback(
    (githubAuthInfo: GithubAuth) => {
      setValue(pre => ({
        ...pre,
        state: {
          ...pre.state,
          currentLoginIdentity: githubAuthInfo ? AuthPlatform.github : AuthPlatform.anonymous,
          githubAuthInfo: githubAuthInfo || pre.state.githubAuthInfo // 不要清空
        }
      }))
    },
    [],
  )

  const toggleLoginIdentity = useCallback((LoginIdentity: AuthPlatform) => {
    setValue(pre => ({
      ...pre,
      state: {
        ...pre.state,
        currentLoginIdentity: LoginIdentity
      }
    }))
  }, [])

  const loginGithub = useCallback(async () => {
    if (githubAuthClientId && parentHref) {
      await openGithubAuth(githubAuthClientId, parentHref)
    } else {
      throw new Error('你是否忘记添加环境变量 github_auth_clientid')
    }
  }, [githubAuthClientId, parentHref])

  const startLogin = useCallback(async (
    selectLoginIdentity: AuthPlatform,
    loginSecc?: () => void,
    loginFailed?: () => void
  ) => {
    switch(selectLoginIdentity) {
      case AuthPlatform.anonymous:
        toggleLoginIdentity(AuthPlatform.anonymous)
        loginSecc?.()
        break
      case AuthPlatform.github:
        if (value.state.githubAuthInfo) {
          loginSecc?.()
          return toggleLoginIdentity(AuthPlatform.github)
        }
        try {
          await loginGithub()
          loginSecc?.()
          toggleLoginIdentity(AuthPlatform.github)
        } catch(err) {
          console.error(err)
          loginFailed?.()
        }
        break
    }
  }, [loginGithub, toggleLoginIdentity, value.state.githubAuthInfo])

  return <GlobalContext.Provider value={
    useMemo(() => ({
      ...value,
      actions: {
        ...value.actions,
        setGithubAuthInfo,
        toggleLoginIdentity,
        startLogin
      }
    }), [setGithubAuthInfo, toggleLoginIdentity, value, startLogin])
  }>
    {children}
  </GlobalContext.Provider>
}

export default StoreProvider
