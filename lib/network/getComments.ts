import Http, { BaseRes } from './http'

export type Params = {
  dbUrlToken: string,
  clusterId: string,
  offset: number,
  limit: number
}

export default function getComments(params: Params) {
  return Http._get(
    '/api/retrieveCommentsByClusterId',
    params
  )
}