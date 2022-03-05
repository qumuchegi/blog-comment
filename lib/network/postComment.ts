import Http, { BaseRes } from './http'
import { ResData as CommentInfoRes} from './getCommentInfoById'

export type Params = {
  clusterId: string,
  content: string,
  commenter: {
    id?: string, // 没有 id 就是匿名
    userName: string,
    avatar: string,
    email: string,
    url: string
  }
}
export default async function postComment(params: Params): Promise<{newComment: CommentInfoRes['comments'][0]}> {
  return Http._post(
    '/api/sendComment',
    params
  )
}