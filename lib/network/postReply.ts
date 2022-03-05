import Http, { BaseRes } from './http'
import { ResData as CommentInfoRes} from './getCommentInfoById'

export type Params = {
  clusterId: string,
  replyTo: {
    topCommentId?: string,
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
export default async function postReply(params: Params): Promise<{newComment: CommentInfoRes['comments'][0]}> {
  return Http._post(
    '/api/sendComment',
    params
  )
}