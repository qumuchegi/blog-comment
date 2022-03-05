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
    replyTo?: {
      replyToCommentId: {
        _id: string,
        commenterId: string,
        replyTo?: {
          // 填充（联表）
          replyToCommentId: string,
          replyToAccountId: string
        }
        // replyTo?: { replyToCommentId: string, replyToAccountId: string }, // true - 一级评论； false - 回复、回复的回复
        content: string,
        createTime: number,
        like: number,
        reply: Array<string> // 直接回复 comment id array
        replyReply: Array<string>// 间接回复，这条评论下回复的回复      
      },
      replyToAccountId: {
        _id: string,
        userName: string,
        email?: string,
        url?: string,
        avatar?: string
      }
    },
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