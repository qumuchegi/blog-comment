import { NextApiRequest, NextApiResponse } from 'next'
import {
  retrieveAccountModel,
  retrieveCommentModel,
  retrieveClusterModel
} from '../../lib/database/index'
import { verifyJWTToken, signJWTToken } from '../../lib/jwt/index'
import catchError from './utils/wrapper/catchError'

async function sendComment(req: NextApiRequest, res: NextApiResponse) {
  const {
    clusterId,
    replyTo,
    content,
    commenter: {
      id: accountId,
      userName,
      avatar,
      email,
      url
    }
  } = req.body
  const accountModel = await retrieveAccountModel()
  const commentModel = await retrieveCommentModel()
  const clusterModel = await retrieveClusterModel()
  let commenterAccountDocument = await accountModel.findOne({id: accountId}).exec()
  if(!commenterAccountDocument) {
    commenterAccountDocument = await accountModel.create({
      _id: accountId,
      userName,
      avatar,
      email,
      url
    })
  }
  let commentDocument
  if (replyTo) {
    commentDocument = await commentModel.create({
      content,
      commenterId: commenterAccountDocument._id,
      createTime: new Date().getTime(),
      like: 0,
      reply: [],
      replyTo
    })
    await commentModel.updateOne({
      _id: replyTo.replyToCommentId
    }, {
      $push: {
        reply: commentDocument._id
      }
    })
  } else {
    commentDocument = await commentModel.create({
      content,
      commenterId: commenterAccountDocument._id,
      createTime: new Date().getTime(),
      like: 0,
      reply: []
    })
  }
  const commentId = commentDocument._id
  let clusterDocument = await clusterModel.findOne({
    id: clusterId
  })
  if(!clusterDocument) {
    clusterDocument = await clusterModel.create(
      {
        comments: [{id: commentId, isTopComment: !replyTo}]
      }
    )
  } else {
    await clusterModel.updateOne(
      {
        id: clusterId
      },
      {
        comments: [...clusterDocument.get('comments'), {id: commentId, isTopComment: !replyTo}]
      }
    )
  }
  res.status(200).json({
    code: 0,
    msg: 'success',
    data: {
      accountId: commenterAccountDocument._id,
      avatar: commenterAccountDocument.avatar,
      userName: commenterAccountDocument.userName,
      url: commenterAccountDocument.url,
      email: commenterAccountDocument.email,
      commentId: commentDocument._id,
      commentContent: commentDocument.content,
      commentCreateTime: commentDocument.createTime,
      commentLikes: commentDocument.like,
      commentReply: commentDocument.reply,
      replyTo
    }
  })
}

export default catchError(sendComment)