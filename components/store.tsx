import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { GithubAuth } from '../types/context'


type ContextValue = {
  state: {
    githubAuthInfo?: GithubAuth
  }
  actions: {
    setGithubAuthInfo: (githubAuthInfo: GithubAuth) => void
  }
}
const DEFAULT_CTX_VALUE: ContextValue = {
  state: {
    githubAuthInfo: undefined
  },
  actions: {
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
          githubAuthInfo
        }
      }))
    },
    [],
  )
  

  return <GlobalContext.Provider value={
    useMemo(() => ({
      ...value,
      actions: {
        ...value.actions,
        setGithubAuthInfo
      }
    }), [setGithubAuthInfo, value])
  }>
    {children}
  </GlobalContext.Provider>
}

export default StoreProvider
