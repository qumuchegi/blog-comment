import { NextApiRequest, NextApiResponse } from 'next'
import {
  retrieveCommentModel,
  retrieveClusterModel
} from '../../lib/database/index'
import catchError from './utils/wrapper/catchError'
import { flatArr } from '../../lib/utils/array'

async function retrieveCommentsId(req: NextApiRequest, res: NextApiResponse) {
  const {
    clusterId,
    offset = 0,
    limit
  } = req.query
  const _offset = Number(offset)
  const _limit = Number(limit)
  // console.log('retrieveCommentsId', {clusterId})
  const clusterModel = await retrieveClusterModel()
  const commentModel = await retrieveCommentModel()
  const clusterDocument = await clusterModel.findOne({
    clusterId: clusterId
  })
  res.setHeader('Cache-Control', 'no-cache')
  if(!clusterDocument) {
    return res.status(200).json({
      code: 0,
      msg: 'success',
      data: []
    })
  }
  const allCommentsId = clusterDocument.comments.filter(i => i.isTopComment).map(i => i.id)
  const topCommentIds = _limit
    // @ts-ignore
    ? allCommentsId.slice(_offset, _limit + _offset)
    // @ts-ignore
    : allCommentsId.slice(_offset)
  // console.log({clusterDocument: clusterDocument.comments})
  // 插入 reply id
  // let allComments = []
  const ids = flatArr( await Promise.all(
    topCommentIds.map(async commentId => {
      const commentDocument = await commentModel.findOne({
        _id: commentId
      })
      const repliesId = commentDocument?.reply ?? []
      // 回复的回复
      const replyRepliesId = commentDocument?.replyReply ?? []
      // console.log(
      //   {
      //     commentDocument,
      //   replyRepliesId
      // })
      return {
        topCommentId: commentId,
        repliesId: repliesId,
        replyRepliesId: replyRepliesId
      }
    })
  ))

  res.status(200).json({
    code: 0,
    msg: 'success',
    data: {
      ids,
      hasMore: _limit + _offset < allCommentsId.length
    }
  })
}

export default catchError(retrieveCommentsId)
