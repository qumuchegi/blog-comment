import Http, { BaseRes } from './http'

export type Params = {
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
      commentIds: [params.id]
    }
  )
}