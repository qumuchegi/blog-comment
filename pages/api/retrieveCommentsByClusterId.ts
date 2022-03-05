import { NextApiRequest, NextApiResponse } from 'next'
import {
  retrieveAccountModel,
  retrieveCommentModel,
  retrieveClusterModel
} from '../../lib/database/index'
import catchError from './utils/wrapper/catchError'

async function retrieveCommentsByClusterId(req: NextApiRequest, res: NextApiResponse) {
  const {
    clusterId,
    offset = 0,
    limit = 10
  } = req.query
  res.setHeader('Cache-Control', 'no-cache')
  const accountModel = await retrieveAccountModel()
  const commentModel = await retrieveCommentModel()
  const clusterModel = await retrieveClusterModel()
  const clusterDocument = await clusterModel.findOne({
    clusterId: clusterId
  })
  if(!clusterDocument) {
    return res.status(200).json({
      code: 0,
      msg: 'success',
      data: []
    })
  }
  const allCommentsId = clusterDocument.comments.filter(i => i.isTopComment).map(i => i.id)
  //@ts-ignore
  const ids = allCommentsId.slice(offset, limit + offset)
  const rawComments = await commentModel.find({
    _id: ids
  })
  const comments = rawComments.map(async item => {
    const commenter = await accountModel.findOne({
      _id: item.commenterId
    })
    const result = {
      id: item._id,
      content: item.content,
      createTime: item.createTime,
      likeNumber: item.like,
      isReply: !!item.replyTo,
      replyNumber:  item.reply ? item.reply.length : 0,
      commenter: {
        accountId: commenter?._id,
        userName: commenter?.userName,
        avatar: commenter?.avatar,
        url: commenter?.url,
        email: commenter?.email,
      }
    }
    return result
  })
  res.status(200).json({
    code: 0,
    msg: 'success',
    data: {
      comments
    }
  })
}

export default catchError(retrieveCommentsByClusterId)