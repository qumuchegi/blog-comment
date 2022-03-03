import jwt from 'jsonwebtoken'

const secret = 'blog_comment_secret_123456' // TODO: 换成 env

export const signJWTToken = (payload: Object) => {
  const token = jwt.sign(payload, secret, {algorithm: 'HS256'}) // TODO: 换成 env
  return token
}

type TokenDecoded = {
  dbUrl: string
}
export const verifyJWTToken = (token: string) => {
  const decoded = jwt.verify(token, secret, {algorithms: ['HS256']}) // TODO: 换成 env
  return decoded as TokenDecoded
}