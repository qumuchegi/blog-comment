import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import catchError from './utils/wrapper/catchError'
import { entriesToObj } from '../../lib/utils/object'
import { serialize } from 'cookie'
import urlParser from 'parse-url'

const GITHUB_AUTH_CONFIG = {
  clientId: process.env.github_auth_clientid,
  clientSecret: process.env.github_auth_secret
}
async function githubLoginCallback(req: NextApiRequest, res: NextApiResponse) {
  const {code: githubAuthCode, redirect_url} = req.query
  console.log(
    'githubLoginCallback',
    {
    githubAuthCode, redirect_url
  })
  
  const tokenResData = await axios.post(
    'https://github.com/login/oauth/access_token',
    {
      client_id: GITHUB_AUTH_CONFIG.clientId,
      client_secret: GITHUB_AUTH_CONFIG.clientSecret,
      code: githubAuthCode
    }
  )
  const githubAuthToken = tokenResData.data
  // console.log({
  //   githubAuthToken
  // })
  //@ts-ignore
  const access_token = entriesToObj(githubAuthToken)?.['access_token']
  // console.log({
  //   access_token
  // })
  if (!access_token) {
    res.redirect(301, redirect_url as string)
  }
  const githubUserInfoRes = await axios.get(`https://api.github.com/user?access_token=${access_token}`, {
    headers: {
      Authorization: 'token ' + access_token
    }
  })
  const userInfo = githubUserInfoRes.data

  const cookies = [
    {
      key: 'auth_username',
      value: userInfo.name || userInfo.login
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
  const {
    protocol,
    resource,
    search
  } = urlParser(redirect_url as string)

  res.setHeader(
    'Set-Cookie',
    cookies.map(({key, value}) => {
      return serialize(key, value, {path: '/'})
    })
  )
  // res.status(200).json({
  //   code: 0,
  //   msg: 'success',
  //   data: {
  //     redirect_url,
  //     authInfo: cookies.reduce((obj, { key, value }) => ({
  //       ...obj,
  //       [key]: value
  //     }), {})
  //   }
  // })
  // console.log({
  //   redirect_url
  // })
  const authInfoToQueryString = cookies.map(({key, value}) => {
    return `${key}=${escape(value)}`
  }).join('&')
  const appendAuthInfoToUrl = redirect_url + (search ? `&${authInfoToQueryString}` : `?${authInfoToQueryString}`)
  console.log(
    {appendAuthInfoToUrl}
  )
  res.redirect(301, appendAuthInfoToUrl as string)
}

export default catchError(githubLoginCallback)