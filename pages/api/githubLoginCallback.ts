import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import catchError from './utils/wrapper/catchError'
import { entriesToObj } from '../../lib/utils/object'
import { serialize } from 'cookie'

const GITHUB_AUTH_CONFIG = {
  clientId: process.env.github_auth_clientid,
  clientSecret: process.env.github_auth_secret
}
async function githubLoginCallback(req: NextApiRequest, res: NextApiResponse) {
  const {code: githubAuthCode, redirect_url} = req.query
  const tokenResData = await axios.post(
    'https://github.com/login/oauth/access_token',
    {
      client_id: GITHUB_AUTH_CONFIG.clientId,
      client_secret: GITHUB_AUTH_CONFIG.clientSecret,
      code: githubAuthCode
    }
  )
  // console.log({
  //   tokenResData
  // })
  const githubAuthToken = tokenResData.data
  //@ts-ignore
  const access_token = entriesToObj(githubAuthToken)?.['access_token']
  console.log({access_token})
  const githubUserInfoRes = await axios.get(`https://api.github.com/user`, {
    headers: {
      Authorization: 'token ' + access_token
    }
  })
  const userInfo = githubUserInfoRes.data

  const cookies = [
    {
      key: 'auth_username',
      value: userInfo.name
    },
    {
      key: 'auth_avatar',
      value: userInfo.avatar_url
    }, 
    {
      key: 'auth_token',
      value: githubAuthToken
    },
    {
      key: 'userHomeUrl',
      value: userInfo.html_url
    },
    {
      key: 'github_userid',
      value: userInfo.id
    }
  ]

  res.setHeader(
    'Set-Cookie',
    cookies.map(({key, value}) => {
      return serialize(key, value, {path: '/'})
    })
  )

  res.redirect(301, redirect_url as string)
}

export default catchError(githubLoginCallback)