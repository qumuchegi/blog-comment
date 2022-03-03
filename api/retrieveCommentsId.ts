import { NextApiRequest, NextApiResponse } from 'next'
import { initDb } from '../lib/database/index'
import { verifyJWTToken } from '../lib/jwt/index'
import catchError from '../api/utils/wrapper/catchError'

async function retrieveCommentsId(req: NextApiRequest, res: NextApiResponse) {
  const {
    dbUrlToken,
    clusterId,
    offset = 0,
    limit = 10
  } = req.body
  const dbUrl = verifyJWTToken(dbUrlToken).dbUrl
  const models =  await initDb(dbUrl)
  const clusterModel = models['CommentClusterSchema']
  const clusterDocument = await clusterModel.findOne({
    _id: clusterId
  })
  if(!clusterDocument) {
    return res.status(200).json({
      code: 0,
      msg: 'success',
      data: []
    })
  }
  const allCommentsId = clusterDocument.comments.filter(i => i.isTopComment).map(i => i.id)
  const ids = allCommentsId.slice(offset, limit + offset)
  res.status(200).json({
    code: 0,
    msg: 'success',
    data: ids
  })
}

export default catchError(retrieveCommentsId)
