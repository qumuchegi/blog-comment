import Http, { BaseRes } from './http'

export type Params = {
  ids: string[]
}

export type ResData = {
  comments: {
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
  }[]
}
export default async function getCommentInfoById(params: Params): Promise<ResData> {
  return Http._post(
    '/api/retrieveCommentsByCommentIds',
    {
      commentIds: params.ids
    }
  )
}