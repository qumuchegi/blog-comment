import React, { Suspense, useState } from 'react'
import Avatar from './avatar'
import { ResData as CommentInfoRes } from '../lib/network/getCommentInfoById'
import CommentSendInput from './CommentSendInput.client'

/**
 * 不要用 useState、useEffect、等
 */
export default function CommentItem({
  articleId,
  commentInfo
}: {
  articleId: string,
  commentInfo: CommentInfoRes['comments'][0]
}) {
  const [isShowReplyInput, setIsShowReplyInput] = useState(false)
  const onClickReply = () => {
    setIsShowReplyInput(true)
  }
  const onSendReplySuccess = () => {
    setIsShowReplyInput(false)
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
          <div onClick={onClickReply}>回复</div>
          <div>赞</div>
        </div>
        {
          isShowReplyInput &&
          <CommentSendInput
            articleId={articleId}
            replyTo={{
              toAccountId: commentInfo.commenter.accountId,
              toAccountAvatar: commentInfo.commenter.avatar,
              toAccountName: commentInfo.commenter.userName,
              toCommentId: commentInfo.id
            }}
          /> 
        }
      </div>
    }
  </div>
}




