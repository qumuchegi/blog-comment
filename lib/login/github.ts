type GithubAuth = {
  userId: string,
  username: string,
  avatar: string,
  userHomeUrl: string,
  // token: string
}
let github_auth_info: GithubAuth
export const cacheGithubAuthInfo = ({
  userId,
  username,
  avatar,
  userHomeUrl,
  // token
}: GithubAuth) => {
  github_auth_info = {
    userId,
    username,
    avatar,
    userHomeUrl,
    // token
  }
}
export const getCachedGithubAuthInfo = () => {
  return github_auth_info
}

const PARENT_GITHUB_AUTH_MSG_START = 'PARENT_GITHUB_AUTH_MSG_START'
export default function openGithubAuth(githubAuthClientId: string, parentHref: string) {
  const url = `https://github.com/login/oauth/authorize?client_id=${githubAuthClientId}`
    + (
      `&redirect_uri=${`${window.location.origin}/api/githubLoginCallback?redirect_url=`
      + encodeURIComponent(window.location.origin + '/blankPageForAuth')}`
    )
  const newWin = window.open(url)
  // 建立和 newWin 的通信频道
  const channel = new BroadcastChannel('github-auth-message')
  channel.addEventListener('message', evt => {
    window.location.reload()
  })
}