type GithubAuth = {
  userId: string,
  username: string,
  avatar: string,
  userHomeUrl: string,
  token: string
}
let github_auth_info: GithubAuth
export const cacheGithubAuthInfo = ({
  userId,
  username,
  avatar,
  userHomeUrl,
  token
}: GithubAuth) => {
  github_auth_info = {
    userId,
    username,
    avatar,
    userHomeUrl,
    token
  }
}
export const getCachedGithubAuthInfo = () => {
  return github_auth_info
}

const PARENT_GITHUB_AUTH_MSG_START = 'PARENT_GITHUB_AUTH_MSG_START'
export default function openGithubAuth() {
  window.parent?.postMessage(
    JSON.stringify({
      msg: PARENT_GITHUB_AUTH_MSG_START
    }),
    '*'
  )
}