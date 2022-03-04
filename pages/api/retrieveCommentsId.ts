import { NextApiRequest, NextApiResponse } from 'next'
import {
  retrieveAccountModel,
  retrieveCommentModel,
  retrieveClusterModel
} from '../../lib/database/index'
import { verifyJWTToken } from '../../lib/jwt/index'
import catchError from './utils/wrapper/catchError'

async function retrieveCommentsId(req: NextApiRequest, res: NextApiResponse) {
  const {
    clusterId,
    offset = 0,
    limit = 10
  } = req.query
  const clusterModel = await retrieveClusterModel()
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
  const ids = allCommentsId.slice(offset, limit + offset)
  res.status(200).json({
    code: 0,
    msg: 'success',
    data: {ids}
  })
}

export default catchError(retrieveCommentsId)
