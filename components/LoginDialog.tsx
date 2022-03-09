import React, { useState, useCallback } from 'react'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Menu } from '@mui/material'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import Image from 'next/image' 
import Button from '@mui/material/Button'
import styles from './styles/LoginDialog.module.css'
import openGithubAuth, { cacheGithubAuthInfo } from '../lib/login/github'
import { entriesToObj } from '../lib/utils/object'

export enum AuthPlatform {
  anonymous = 'anonymous', // 匿名
  github = 'github',
  weChat = 'weChat'
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
  openLoginDialog: boolean,
  onRequestCLose?: () => void,
  onLoginSuccess: (
    authType: AuthPlatform
  ) => void,
  onLoginFailed: () => void,

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
  },
  // {
  //   platform: AuthPlatform.weChat,
  //   imgUrl: '/wechat.png',
  //   label: '微信'
  // }
]
export default function LoginDialog(
  props: IProps
) {
  const  {
    openLoginDialog,
    onRequestCLose,
    onLoginSuccess,
    onLoginFailed
  } = props
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<AuthPlatform>(AuthPlatform.anonymous)
  const onSelectPlatform = useCallback((event: SelectChangeEvent) => {
    //@ts-ignore
    setSelectedPlatform(event.target.value as AuthPlatform)
  }, [])
  const handleCloseLoginDialog = useCallback(() => {
    onRequestCLose?.()
  }, [onRequestCLose])
  const login = useCallback(async () => {
    setIsLoginLoading(true)
    if (selectedPlatform === AuthPlatform.anonymous) {
      onLoginSuccess(AuthPlatform.anonymous)
      return handleCloseLoginDialog()
    }
    // github
    if (selectedPlatform === AuthPlatform.github) {
      try {
        await openGithubAuth(
          //window.location.href//.replace('https', 'http')
        )
        const {
          userHomeUrl,
          auth_username,
          auth_avatar,
          auth_token,
          github_userid
        } = entriesToObj<{
          userHomeUrl: string,
          auth_username: string,
          auth_avatar: string,
          auth_token: string,
          github_userid: string
        }>(document.cookie, ';', (value) => window.decodeURIComponent(value))
        //ts-ignoew
        cacheGithubAuthInfo({
          userId: github_userid,
          userHomeUrl,
          username: auth_username,
          avatar: auth_avatar,
          token: auth_token
        })
        onLoginSuccess(AuthPlatform.github)
      } catch(err) {
        console.error(err)
      }
    } else {
      onLoginSuccess(AuthPlatform.anonymous)
    }
    setIsLoginLoading(false)
  } ,[handleCloseLoginDialog, onLoginSuccess, selectedPlatform])
  return <div>
    <Dialog
      onClose={handleCloseLoginDialog}
      open={openLoginDialog}
    >
    <div className={styles.dialogBody}>
      <DialogTitle>选择评论身份</DialogTitle>
        <Select label='评论身份' onChange={onSelectPlatform} value={selectedPlatform}>
          {
            IDENTITIES.map(({
              platform,
              label,
              imgUrl
            }) => <MenuItem value={platform} key={platform}>
                <div className={styles.platformItem}>
                  <Image src={imgUrl} alt={label} width={15} height={15}/>
                  <span>{label}</span>
                </div>
            </MenuItem>)
          }
        </Select>
        <Button variant="contained" onClick={login}>登录</Button>
      </div>
    </Dialog>
  </div>
}