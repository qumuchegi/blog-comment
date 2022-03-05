import Http, { BaseRes } from './http'

interface Params {
  commentId: string
}
export default async function postLikeComment(params: Params) {
  const res = await Http._post(
    '/api/likeComment',
    params
  )
  return res
}