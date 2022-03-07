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
const redirect_url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://blog-comment-mocha.vercel.app'
export default function openGithubAuth(callbackUrl: string) {
  window.location.href = 
    `https://github.com/login/oauth/authorize?client_id=${github_auth_clientid}&redirect_uri=${`${redirect_url}/api/githubLoginCallback?redirect_url=` + callbackUrl}`
}