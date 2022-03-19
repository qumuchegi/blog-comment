import React, { useState, useEffect, useCallback, useRef } from 'react'
import getCommentIds, { ResData as CommentIds  } from '../lib/network/getCommentIds'
import CommentItem from './CommentItem'
import getCommentInfoById, { ResData as CommentInfoRes } from '../lib/network/getCommentInfoById'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'


const LIMIT = 7
export default function CommentList({
  clusterId,
  beforeInteract,
  onDataLoadSuccess,
  toggleIdentity
}: {
  clusterId: string,
  beforeInteract: <T>(hadLoginCallback: T) => T,
  onDataLoadSuccess?: () => void
  toggleIdentity?: () => void
}) {
  const offsetRef = useRef(0)
  const [hasMore, setHasMore] = useState(true)
  const [isInitLoading, setIsInitLoading] = useState(true)
  const [isFetchMore, setIsFetchMore] = useState(false)
  const [commentInfos, setCommentInfos] = useState<(CommentInfoRes['comments'][0] & {topCommentId?: string})[]>([])
  // query all comment and reply id
  const fetchComments: (offset?: number) => Promise<[] | CommentIds['ids']> = useCallback(async (offset) => {
    try {
      const data = await getCommentIds(
        {
         clusterId,
         offset: offset ?? 0,
         limit: LIMIT
       }
      )
      setHasMore(data?.hasMore)
      return data?.ids ?? []
    } catch (err) {
      console.error(err)
      return []
    }
  }, [clusterId])

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
  const fetch = useCallback( async (offset?: number) => {
    const commentIds = await fetchComments(offset)
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
      setIsInitLoading(false)
      offsetRef.current += commentIds.length
      setCommentInfos(pre => [...pre, ...markTopCommentTopCommentInfos(commentIds, data.comments)] )
    } catch (err) {
      console.error({err});
      setCommentInfos( [] )
    }
    onDataLoadSuccess?.()
  }, [fetchComments, markTopCommentTopCommentInfos, onDataLoadSuccess])

  useEffect(() => {
    fetch(0)
  }, [fetch])

  const fetchMore = useCallback(async () => {
    setIsFetchMore(true)
    await fetch(offsetRef.current)
    setIsFetchMore(false)
  }, [fetch])

  return <div>
    <div style={{ display: 'flex', flex: 1, justifyContent: 'center'}}>
      {
        isInitLoading && <CircularProgress color="inherit" />
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
    {
      !isInitLoading && hasMore && 
      <div style={{display: 'flex', justifyContent: 'center', flex: 1}}>
        <Button variant='text' onClick={fetchMore}>
          {isFetchMore ? '加载中...' : '加载更多'}
        </Button>
      </div>
    }
  </div>
}
