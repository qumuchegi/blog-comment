import { NextApiRequest, NextApiResponse } from 'next'
import {
  retrieveAccountModel,
  retrieveCommentModel,
  retrieveClusterModel
} from '../../lib/database/index'
import { verifyJWTToken } from '../../lib/jwt/index'
import catchError from './utils/wrapper/catchError'
import { flatArr } from '../../lib/utils/array'

async function retrieveCommentsId(req: NextApiRequest, res: NextApiResponse) {
  const {
    clusterId,
    offset = 0,
    limit
  } = req.query
  const clusterModel = await retrieveClusterModel()
  const commentModel = await retrieveCommentModel()
  const clusterDocument = await clusterModel.findOne({
    id: clusterId
  })
  if(!clusterDocument) {
    return res.status(200).json({
      code: 0,
      msg: 'success',
      data: []
    })
  }
  const allCommentsId = clusterDocument.comments.filter(i => i.isTopComment).map(i => i.id)
  // @ts-ignore
  const topCommentIds = limit ? allCommentsId.slice(offset, limit + offset) : allCommentsId.slice(offset)
  // 插入 reply id
  const ids = flatArr( await Promise.all(
    topCommentIds.map(async commentId => {
      const commentDocument = await commentModel.findOne({
        _id: commentId
      })
      const repliesId = commentDocument?.reply ?? []
      return [commentId, ...repliesId]
    })
  ))
  res.status(200).json({
    code: 0,
    msg: 'success',
    data: {ids}
  })
}

export default catchError(retrieveCommentsId)
