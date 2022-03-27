import React, { useState, useCallback, useMemo } from 'react'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Image from 'next/image' 
import Button from '@mui/material/Button'
import styles from './styles/LoginDialog.module.css'
import openGithubAuth, { cacheGithubAuthInfo } from '../lib/login/github'
import Modal from '@mui/material/Modal';
import { useStoreAction, useStoreState } from './store'
import Alert from '@mui/material/Alert'

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
  openLoginDialog: boolean,
  onRequestCLose?: () => void,
  onLoginSuccess: (
    authType: AuthPlatform
  ) => void,
  onLoginFailed: () => void,
  auth?: AuthPlatform[] // ['github', 'anonymous']
  githubAuthClientId?: string
  parentHref: string
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
    onLoginFailed,
    auth = [AuthPlatform.anonymous, AuthPlatform.github],
    githubAuthClientId,
    parentHref
  } = props
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [loginWithoutIdent, setLoginWithoutIdent] = useState(false)
  const [currentLoginIdentity, maybeLoginedGithubInfo] = useStoreState(state => [
    state.currentLoginIdentity,
    state.githubAuthInfo
  ])
  const _IDENTITIES = useMemo(() => {
    const _auth = (!auth || auth.length === 0) ? [AuthPlatform.anonymous, AuthPlatform.github] : auth
    return IDENTITIES.filter(i => _auth.includes(i.platform))
  }, [auth])
  const [toggleLoginIdentity, setGithubAuthInfo] = useStoreAction(actions => [actions.toggleLoginIdentity, actions.setGithubAuthInfo])
  const [selectedPlatform, setSelectedPlatform] = useState<AuthPlatform>(_IDENTITIES[0].platform)
  const onSelectPlatform = useCallback((event: SelectChangeEvent) => {
    if (event.target.value) {
      setLoginWithoutIdent(false)
    }
    //@ts-ignore
    setSelectedPlatform(event.target.value as AuthPlatform)
  }, [])
  const handleCloseLoginDialog = useCallback(() => {
    onRequestCLose?.()
  }, [onRequestCLose])
  const login = useCallback(async () => {
    if(!selectedPlatform) {
      return setLoginWithoutIdent(true)
    }
    setIsLoginLoading(true)
    if (selectedPlatform === AuthPlatform.anonymous) {
      onLoginSuccess(AuthPlatform.anonymous)
      setIsLoginLoading(false)
      return handleCloseLoginDialog()
    }
    // github
    if (selectedPlatform === AuthPlatform.github) {
      if (maybeLoginedGithubInfo) {
        onLoginSuccess(AuthPlatform.github)
        setIsLoginLoading(false)
        handleCloseLoginDialog()
        return toggleLoginIdentity(AuthPlatform.github)
      }
      if (githubAuthClientId) {
        try {
          await openGithubAuth(githubAuthClientId, parentHref)
        } catch(err) {
          console.error(err)
        }
      } else {
        throw new Error('你是否忘记添加环境变量 github_auth_clientid')
      }
    } else {
      onLoginSuccess(AuthPlatform.anonymous)
    }
    setIsLoginLoading(false)
  } ,[githubAuthClientId, handleCloseLoginDialog, maybeLoginedGithubInfo, onLoginSuccess, parentHref, selectedPlatform, toggleLoginIdentity])

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
            _IDENTITIES.map(({
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
        {
          loginWithoutIdent
          && <Alert severity="warning">选择身份!</Alert>
        }
      </div>
    {/* </Dialog> */}
    </Modal>
  </div>
}