import React, { useState, useEffect, useCallback } from 'react'
import getCommentIds, { ResData as CommentIds  } from '../lib/network/getCommentIds'
import CommentItem from './CommentItem'
import getCommentInfoById, { ResData as CommentInfoRes } from '../lib/network/getCommentInfoById'
import CircularProgress from '@mui/material/CircularProgress'

const LIMIT = 10
export default function CommentList({
  clusterId,
  offset = 0,
  beforeInteract,
  onDataLoadSuccess,
  toggleIdentity
}: {
  clusterId: string,
  offset?: number,
  beforeInteract: <T>(hadLoginCallback: T) => T,
  onDataLoadSuccess?: () => void
  toggleIdentity?: () => void
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [commentInfos, setCommentInfos] = useState<(CommentInfoRes['comments'][0] & {topCommentId?: string})[]>([])
  // query all comment and reply id
  const fetchComments: () => Promise<[] | CommentIds['ids']> = useCallback(async () => {
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
  }, [clusterId, offset])

  // mark topCommentId to reply
  const markTopCommentTopCommentInfos= useCallback((
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
  }, [])

  // query comment and reply details by id
  const fetch = useCallback( async () => {
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
      setIsLoading(false)
      setCommentInfos( markTopCommentTopCommentInfos(commentIds, data.comments) )
    } catch (err) {
      console.error({err});
      setCommentInfos( [] )
    }
    onDataLoadSuccess?.()
  }, [fetchComments, markTopCommentTopCommentInfos, onDataLoadSuccess])

  useEffect(() => {
    fetch()
  }, [fetch])

  return <div>
    <div style={{ display: 'flex', flex: 1, justifyContent: 'center'}}>
      {
        isLoading && <CircularProgress color="inherit" />
      }
    </div>
    {
      commentInfos?.length > 0 &&
      commentInfos.map((info) => <div key={info.id}>
        <CommentItem
          commentInfo={info}
          articleId={clusterId}
          topCommentId={info?.topCommentId}
          beforeInteract={beforeInteract}
          onSendReply={onDataLoadSuccess}
          toggleIdentity={toggleIdentity}
        />
      </div>
      )
    }
  </div>
}
