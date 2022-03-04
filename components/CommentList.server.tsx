import React, { Suspense } from 'react'
import getCommentIds, { ResData as CommentIds  } from '../lib/network/getCommentIds'
import useData from '../lib/cache/useData'
import CommentItem from './CommentItem.client'
import getCommentInfoById, { ResData as CommentInfoRes } from '../lib/network/getCommentInfoById'


const LIMIT = 10
function CommentList1({
  clusterId,
  offset = 0
}: {
  clusterId: string,
  offset?: number
}) {
  const fetchComments: () => Promise<[] | CommentIds['ids']> = async () => {
    try {
      const data = await getCommentIds(
        {
         clusterId,
         offset,
        //  limit: LIMIT
       }
      )
      return data?.ids
    } catch (err) {
      console.error(err)
      return []
    }
  }

  const commentInfos: CommentInfoRes['comments'] | [] = useData(`CommentItem-${clusterId}-${offset}`, async () => {
    const commentIds = await fetchComments()
    try {
      const data = await getCommentInfoById(
        {
         ids: commentIds
       }
      )
      return data.comments
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
    <CommentList1
      clusterId={clusterId}
      offset={offset}
    />
  </Suspense>
}