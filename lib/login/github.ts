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
const github_auth_clientid = 'a3038c6aecde7bd31b6e'
export default function openGithubAuth(callbackUrl: string) {
  window.location.href = 
    `https://github.com/login/oauth/authorize?client_id=${github_auth_clientid}&redirect_uri=${'https://blog-comment-mocha.vercel.app/api/githubLoginCallback?redirect_url=' + callbackUrl}`
}