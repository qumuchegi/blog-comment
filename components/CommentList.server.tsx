import React, { Suspense } from 'react'
import getCommentIds, { ResData as CommentIds  } from '../lib/network/getCommentIds'
import useData from '../lib/cache/useData'
import CommentItem from './CommentItem.server'

const LIMIT = 10
function CommentList1({
  clusterId,
  offset = 0
}: {
  clusterId: string,
  offset?: number
}) {
  const commentIds: [] | CommentIds['ids'] = useData(
    clusterId + offset,
    async () => {
      console.log('wefere');
      try {
        const data = await getCommentIds(
          {
           clusterId,
           offset,
           limit: LIMIT
         }
        )
        console.log({data});
        return data?.ids
      } catch (err) {
        console.error(err)
        return []
      }
    }
  )

  return <div>
    {
      commentIds.length > 0 &&
      commentIds.map((id) => <div key={id}>
        <CommentItem
          id={id}
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