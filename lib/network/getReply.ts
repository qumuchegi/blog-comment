import Http, { BaseRes } from './http'

export type Params = {
  dbUrlToken: string,
  commentIds: Array<string>
}

export default function getComments(params: Params) {
  return Http._get(
    '/api/retrieveCommentsByCommentIds',
    params
  )
}