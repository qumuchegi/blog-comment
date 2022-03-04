import Http, { BaseRes } from './http'

type Params = {
  clusterId: string,
  offset: number,
  limit?: number
}
export interface ResData {
  ids: string[]
}
export default function getCommentIds(params: Params): Promise<ResData> {
  return Http._get(
    '/api/retrieveCommentsId',
    params
  )
}