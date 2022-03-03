import { NextApiRequest, NextApiResponse } from 'next'
import { initDb } from '../lib/database/index'
import { verifyJWTToken } from '../lib/jwt/index'
import catchError from '../api/utils/wrapper/catchError'

async function sendComment(req: NextApiRequest, res: NextApiResponse) {
  const {
    dbUrlToken,
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
  const dbUrl = verifyJWTToken(dbUrlToken).dbUrl
  const models =  await initDb(dbUrl)
  const accountModel = models['AccountSchema']
  const commentModel = models['CommentSchema']
  const clusterModel = models['CommentClusterSchema']
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
    _id: clusterId
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
        _id: clusterId
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