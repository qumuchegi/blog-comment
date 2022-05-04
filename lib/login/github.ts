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

export default function openGithubAuth(githubAuthClientId: string, parentHref: string) {
  const url = `https://github.com/login/oauth/authorize?client_id=${githubAuthClientId}`
    + (
      `&redirect_uri=${`${window.location.origin}/api/githubLoginCallback?redirect_url=`
      + encodeURIComponent(parentHref)}`
    )
  window.open(url)
  window.parent.close()
}