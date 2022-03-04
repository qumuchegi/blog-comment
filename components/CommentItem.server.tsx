import React from 'react'
import getCommentInfoById, { ResData as CommentInfo } from '../lib/network/getCommentInfoById'
import useData from '../lib/cache/useData'
import Avatar from './avatar'

/**
 * 不要用 useState、useEffect、等
 */
export default function CommentItem({
  id
}: {
  id: string
}) {
  const commentInfo: CommentInfo | null = useData(id, async () => {
    try {
      const data = await getCommentInfoById(
        {
         id
       }
      )
      return data
    } catch (err) {
      return null
    }
  })
  const onClickCommenter = () => {

  }
  return <div style={{
    paddingLeft: commentInfo?.isReply ? '20px' : '0px'
  }}>
    {
      commentInfo
      && <div onClick={onClickCommenter}>
        <div>
          <Avatar avatarUrl={commentInfo?.commenter?.avatar}/>
          <div>{commentInfo?.commenter?.userName}</div>
          <div>{commentInfo?.commenter?.email}</div>
        </div>
        <div>
          <div>{commentInfo?.content}</div>
        </div>
        <div>
          <div>回复</div>
          <div>赞</div>
        </div>
      </div>
    }
  </div>
}




