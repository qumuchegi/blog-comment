import React from 'react'
import getCommentIds, { ResData as CommentIds  } from '../lib/network/getCommentIds'
import useData from '../lib/cache/useData'
import CommentItem from './CommentItem.server'

const LIMIT = 10
export default function CommentList({
  dbUrlToken,
  clusterId,
  offset = 0
}: {
  dbUrlToken: string,
  clusterId: string,
  offset?: number
}) {
  const commentIds: [] | CommentIds['ids'] = useData(
    dbUrlToken + clusterId,
    async () => {
      try {
        const data = await getCommentIds(
          {
           dbUrlToken,
           clusterId,
           offset,
           limit: LIMIT
         }
        )
        return data
      } catch (err) {
        return null
      }
    }
  )

  return <div>
    {
      commentIds.map((id) => <div key={id}>
        <CommentItem
          dbUrlToken={dbUrlToken}
          id={id}
        />
      </div>)
    }
  </div>
}
