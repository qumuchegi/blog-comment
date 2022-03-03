import Http, { BaseRes } from './http'

export type Params = {
  dbUrlToken: string,
  clusterId: string,
  replyTo: {
    replyToCommentId: string,
    replyToAccountId: string
  },
  content: string,
  commenter: {
    id: string,
    userName: string,
    avatar: string,
    email: string,
    url: string
  }
}
export default async function postReply(params: Params) {
  const res = await Http._post(
    '/api/sendComment',
    params
  )
  return res
}