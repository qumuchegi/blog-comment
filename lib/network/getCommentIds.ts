import Http, { BaseRes } from './http'

type Params = {
  clusterId: string,
  offset: number,
  limit?: number
}
export interface ResData {
  ids: {
    topCommentId: string,
    repliesId: string[],
    replyRepliesId: string[]
  }[]
  hasMore: boolean
}
export default function getCommentIds(params: Params): Promise<ResData> {
  return Http._get(
    '/api/retrieveCommentsId',
    params
  )
}