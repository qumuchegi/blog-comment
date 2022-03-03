import Http, { BaseRes } from './http'

export type Params = {
  dbUrlToken: string,
  id: string
}

export type ResData = {
  id: string,
  content: string,
  createTime: number,
  likeNumber: number,
  isReply: boolean,
  replyNumber: number,
  commenter: {
    accountId: string,
    userName: string,
    avatar: string,
    url: string,
    email: string,
  }
}

export default function getCommentInfoById(params: Params): Promise<ResData> {
  return Http._get(
    '/api/retrieveCommentsByCommentIds',
    {
      dbUrlToken: params.dbUrlToken,
      commentIds: [params.id]
    }
  )
}