import React, { useState, useCallback, useMemo } from 'react'
import Image from 'next/image' 
import styles from './styles/LoginDialog.module.css'
import openGithubAuth from '../lib/login/github'
import { useStoreAction, useStoreState } from '../lib/store'
import LoadingMask from './LoaingMask'
import { MenuItem, Select } from '@mui/material'

export enum AuthPlatform {
  anonymous = 'anonymous', // 匿名
  github = 'github'
}
export type LoginIdentity = {
  authPlatform: AuthPlatform,
  userId: string,
  userName: string,
  email?: string,
  url?: string,
  avatar?: string,
  token?: string
}
interface IProps {
  children?: React.ReactChild
}
const IDENTITIES = [
  {
    platform: AuthPlatform.anonymous,
    imgUrl: '/anonymous_avatar.png',
    label: 'Anonymous'
  }, {
    platform: AuthPlatform.github,
    imgUrl: '/github-fill.png',
    label: 'Github',
  }
]
export default function LoginDialog(
  props: IProps
) {
  const  {
    children
  } = props
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [isShowSelect, setIsShowSelect] = useState(false)
  const [authConfig] = useStoreState(state => [
    state.authConfig
  ])
  const _IDENTITIES = useMemo(() => {
    const _auth = (!authConfig || authConfig.length === 0) ? [AuthPlatform.anonymous, AuthPlatform.github] : authConfig
    return IDENTITIES.filter(i => _auth.includes(i.platform))
  }, [authConfig])
  const [
    startLogin
  ] = useStoreAction(actions => [
    actions.startLogin
  ])
  const [ currentLoginIdentity ] = useStoreState(state => [state.currentLoginIdentity])
  const login = useCallback(async (selectedPlatform) => {
    setIsLoginLoading(true)
    startLogin(
      selectedPlatform,
      () => {
        setIsLoginLoading(false)
        setIsShowSelect(false)
      },
      () => {
        setIsLoginLoading(false)
      }
    )
  } ,[startLogin])

  const onSelectPlatform = useCallback((value: AuthPlatform) => {
    login(value)
  }, [login])

  return (<>
    <LoadingMask isShow={isLoginLoading}/>
    <div style={{
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center'
    }}>
      <div onClick={() => setIsShowSelect(pre => !pre)}>
        {children}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'flex-start',
        marginLeft: '20px'
      }}>
      {
        isShowSelect &&
        <Select
          value={currentLoginIdentity}
          onChange={(e) => onSelectPlatform(e.target.value)}
          variant='standard'
          autoFocus
          autoWidth
        >
          {
             _IDENTITIES.map(({
              platform,
              label,
              imgUrl
            }) => <MenuItem key={platform} value={platform}>
                <div
                  className={styles.platformItem}
                >
                  <Image src={imgUrl} alt={label} width={20} height={20}/>
                  <span>{label}</span>
                </div>
            </MenuItem>)
          }
        </Select>
       
      }
      </div>
    </div>
  </>
  )
}