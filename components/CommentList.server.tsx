import React, { Suspense } from 'react'
import getCommentIds, { ResData as CommentIds  } from '../lib/network/getCommentIds'
import useData from '../lib/cache/useData'
import CommentItem from './CommentItem.client'
import getCommentInfoById, { ResData as CommentInfoRes } from '../lib/network/getCommentInfoById'

const LIMIT = 10
function CommentListWithData({
  clusterId,
  offset = 0
}: {
  clusterId: string,
  offset?: number
}) {
  // query all comment and reply id
  const fetchComments: () => Promise<[] | CommentIds['ids']> = async () => {
    try {
      const data = await getCommentIds(
        {
         clusterId,
         offset,
        //  limit: LIMIT
       }
      )
      return data?.ids ?? []
    } catch (err) {
      console.error(err)
      return []
    }
  }

  // mark topCommentId to reply
  const markTopCommentTopCommentInfos= (
    commentIds: CommentIds['ids'],
    commentInfos: CommentInfoRes['comments']
  ) => {
    let startIndex = 0
    let result: (CommentInfoRes['comments'][0] & {topCommentId?: string})[] = []
    commentIds.forEach(({
      topCommentId,
      repliesId,
      replyRepliesId
    }) => {
      const endIndex = 1 + repliesId.length + replyRepliesId.length
      const topComment = commentInfos[startIndex]
      result.push(...[
        topComment,
        ...commentInfos
          .slice(startIndex + 1, endIndex + 1)
          .map(item => ({...item, topCommentId: topComment.id}))
      ])
      startIndex += endIndex + 1
    })
    return result.filter(i => i)
  }

  // query comment and reply details by id
  const commentInfos: (CommentInfoRes['comments'][0] & {topCommentId?: string})[] = useData(`CommentItem-${clusterId}-${offset}`, async () => {
    const commentIds = await fetchComments()
    try {
      let flatIds: string[] = []
      commentIds.map(({
        topCommentId,
        repliesId,
        replyRepliesId
      }) => flatIds.push(...[topCommentId, ...repliesId, ...replyRepliesId]))
      const data = await getCommentInfoById(
        {
         ids: flatIds
       }
      )
      return markTopCommentTopCommentInfos(commentIds, data.comments)
    } catch (err) {
      console.error({err});
      return []
    }
  })

  // console.log({commentInfos});
  return <div>
    {
      commentInfos?.length > 0 &&
      commentInfos.map((info) => <div key={info.id}>
        <CommentItem
          commentInfo={info}
          articleId={clusterId}
          topCommentId={info?.topCommentId}
        />
      </div>)
    }
  </div>
}

export default function CommentList(
  {
    clusterId,
    offset = 0
  }: {
    clusterId: string,
    offset?: number
  }
) {
  return <Suspense fallback={<div>loading</div>}>
    <CommentListWithData
      clusterId={clusterId}
      offset={offset}
    />
  </Suspense>
}