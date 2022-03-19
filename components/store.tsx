import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { GithubAuth } from '../types/context'
import { AuthPlatform } from './LoginDialog'

type ContextValue = {
  state: {
    currentLoginIdentity: AuthPlatform,
    githubAuthInfo?: GithubAuth
  }
  actions: {
    toggleLoginIdentity: (LoginIdentity: AuthPlatform) => void,
    setGithubAuthInfo: (githubAuthInfo: GithubAuth) => void
  }
}
const DEFAULT_CTX_VALUE: ContextValue = {
  state: {
    currentLoginIdentity: AuthPlatform.anonymous,
    githubAuthInfo: undefined
  },
  actions: {
    toggleLoginIdentity: (LoginIdentity: AuthPlatform) => {},
    setGithubAuthInfo: (githubAuthInfo: GithubAuth) => {}
  }
}
const GlobalContext = createContext<ContextValue>(DEFAULT_CTX_VALUE)

export const useStoreState = (getter: (state: ContextValue['state']) => any) => getter(useContext(GlobalContext).state)

export const useStoreAction = (getter: (actions: ContextValue['actions']) => any) => getter(useContext(GlobalContext).actions)

const StoreProvider: React.FC<{
  children: React.ReactChild
}> = ({
  children
}) => {
  const [value, setValue] = useState<ContextValue>(DEFAULT_CTX_VALUE)

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

  return <GlobalContext.Provider value={
    useMemo(() => ({
      ...value,
      actions: {
        ...value.actions,
        setGithubAuthInfo,
        toggleLoginIdentity
      }
    }), [setGithubAuthInfo, toggleLoginIdentity, value])
  }>
    {children}
  </GlobalContext.Provider>
}

export default StoreProvider
