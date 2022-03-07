import mongoose from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  retrieveAccountModel,
  retrieveCommentModel,
  retrieveClusterModel
} from '../../lib/database/index'
import { AccountType } from '../../lib/database/schema/account'
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
  let commenterAccountDocument = await accountModel.findOne({customId: accountId}).exec()
  if(!commenterAccountDocument) {
    commenterAccountDocument = await accountModel.create({
      // _id: accountId,
      customId: accountId,
      accountType: accountId ? AccountType.github : AccountType.Anonymous,
      userName,
      avatar,
      email,
      url
    })
  }
  let commentDocument
  const now = new Date().getTime()
  if (replyTo) {
    commentDocument = await commentModel.create({
      content,
      commenterId: commenterAccountDocument._id,
      createTime: new Date().getTime(),
      like: 0,
      reply: [],
      replyReply: [],
      replyTo: {
        replyToCommentId: replyTo.replyToCommentId,
        replyToAccountId: replyTo.replyToAccountId
      }
    })
    await commentModel.updateOne({
      _id: replyTo.replyToCommentId
    }, {
      $push: {
        reply: commentDocument._id
      }
    })
    if (replyTo.topCommentId) {
      await commentModel.updateOne(
        {
          _id: replyTo.topCommentId
        }, {
          $push: {
            replyReply: commentDocument._id
          }
        }
      )
    }
  } else {
    commentDocument = await commentModel.create({
      content,
      commenterId: commenterAccountDocument._id,
      createTime: now,
      like: 0,
      reply: [],
      replyReply: []
    })
  }
  const commentId = commentDocument._id
  let clusterDocument = await clusterModel.findOne({
    clusterId: clusterId
  })
  if(!clusterDocument) {
    clusterDocument = await clusterModel.create(
      {
        clusterId: clusterId,
        comments: [{id: commentId, isTopComment: !replyTo}]
      }
    )
  } else {
    await clusterModel.updateOne(
      {
        clusterId: clusterId
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
      newComment: {
        id: commentDocument._id,
        content: commentDocument.content,
        createTime: commentDocument.createTime,
        likeNumber: 0,
        isReply: !!commentDocument.replyTo,
        replyTo: replyTo ? {
          replyToCommentId: (await commentModel.findById(replyTo.replyToCommentId))?.toObject(),
          replyToAccountId: commenterAccountDocument.toObject()
        } : undefined,
        replyNumber: 0,
        commenter: {
          accountId: commenterAccountDocument?._id,
          accountType: commenterAccountDocument?.accountType,
          userName: commenterAccountDocument?.userName,
          avatar: commenterAccountDocument?.avatar,
          url: commenterAccountDocument?.url,
          email: commenterAccountDocument?.email,
        }
      }
    }
  })
}

export default catchError(sendComment)