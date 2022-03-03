import Http, { BaseRes } from './http'

export type Params = {
  dbUrlToken: string,
  clusterId: string,
  content: string,
  commenter: {
    id: string,
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