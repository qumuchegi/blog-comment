import React, { Suspense } from 'react'
import getCommentIds, { ResData as CommentIds  } from '../lib/network/getCommentIds'
import useData from '../lib/cache/useData'
import CommentItem from './CommentItem.server'

const LIMIT = 10
function CommentList1({
  dbUrlToken,
  clusterId,
  offset = 0
}: {
  dbUrlToken: string,
  clusterId: string,
  offset?: number
}) {
  const commentIds: [] | CommentIds['ids'] = useData(
    dbUrlToken + clusterId + offset,
    async () => {
      console.log('wefere');
      try {
        const data = await getCommentIds(
          {
           dbUrlToken,
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
          dbUrlToken={dbUrlToken}
          id={id}
        />
      </div>)
    }
  </div>
}

export default function CommentList(
  {
    dbUrlToken,
    clusterId,
    offset = 0
  }: {
    dbUrlToken: string,
    clusterId: string,
    offset?: number
  }
) {
  return <Suspense fallback={<div>loading</div>}>
    <CommentList1
      dbUrlToken={dbUrlToken}
      clusterId={clusterId}
      offset={offset}
    />
  </Suspense>
}