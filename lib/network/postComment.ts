import Http, { BaseRes } from './http'

export type Params = {
  clusterId: string,
  content: string,
  commenter: {
    id?: string, // 没有 id 就是匿名
    userName: string,
    avatar: string,
    email: string,
    url: string
  }
}
export default async function postComment(params: Params) {
  const res = await Http._post(
    '/api/sendComment',
    params
  )
  return res
}