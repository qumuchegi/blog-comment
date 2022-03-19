import React, { useState, useCallback } from 'react'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Image from 'next/image' 
import Button from '@mui/material/Button'
import styles from './styles/LoginDialog.module.css'
import openGithubAuth, { cacheGithubAuthInfo } from '../lib/login/github'
import Modal from '@mui/material/Modal';

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
      setIsLoginLoading(false)
      return handleCloseLoginDialog()
    }
    // github
    if (selectedPlatform === AuthPlatform.github) {
      try {
        await openGithubAuth()
      } catch(err) {
        console.error(err)
      }
    } else {
      onLoginSuccess(AuthPlatform.anonymous)
    }
    setIsLoginLoading(false)
  } ,[handleCloseLoginDialog, onLoginSuccess, selectedPlatform])

  if (!openLoginDialog) {
    return null
  }
  return <div>
    <Modal
      open={openLoginDialog}
      // onClose={handleCloseLoginDialog}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      BackdropProps={{
        timeout: 500
      }}
    >
    {/* <Dialog
      onClose={handleCloseLoginDialog}
      open={openLoginDialog}
    > */}
    <div className={styles.dialogBody}>
      <h3>选择参与评论身份</h3>
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
        <Button
          variant="contained"
          onClick={login}
          style={{backgroundColor: 'black'}}
        >
          {
            isLoginLoading
            ? '正在登录...'
            : '登录'
          }
        </Button>
      </div>
    {/* </Dialog> */}
    </Modal>
  </div>
}