import React, { Suspense } from 'react'
import Avatar from './avatar'
import { ResData as CommentInfoRes } from '../lib/network/getCommentInfoById'
/**
 * 不要用 useState、useEffect、等
 */
export default function CommentItem({
  commentInfo
}: {
  commentInfo: CommentInfoRes['comments'][0]
}) {

  const onClickCommenter = () => {

  }
  return <div style={{
    paddingLeft: commentInfo?.isReply ? '20px' : '0px'
  }}>
    {
      commentInfo
      && <div>
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




