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
const github_auth_clientid = process.env.github_auth_clientid || 'a3038c6aecde7bd31b6e'
// console.log('github_auth_clientid', github_auth_clientid, process.env.github_auth_clientid)
const HOST = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://blog-comment-mocha.vercel.app'

const PARENT_GITHUB_AUTH_MSG_START = 'PARENT_GITHUB_AUTH_MSG_START'
export default function openGithubAuth(callbackUrl?: string) {
  window.parent?.postMessage(
    JSON.stringify({
      msg: PARENT_GITHUB_AUTH_MSG_START,
      data: {
        github_auth_clientid,
        commentDeployUrlHost: HOST,
        callbackUrl
      }
    }),
    '*'
  )

  // const url = `https://github.com/login/oauth/authorize?client_id=${github_auth_clientid}`
  //   + `&redirect_uri=${`${HOST}/api/githubLoginCallback?redirect_url=` + callbackUrl}`
  // window.location.href = url
    // HOST + '/api/proxyIframeResponse?targetUrl='
    //   + encodeURIComponent(url)
}