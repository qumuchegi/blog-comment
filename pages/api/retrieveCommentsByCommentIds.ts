import mongoose from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  retrieveAccountModel,
  retrieveCommentModel
} from '../../lib/database/index'
import { SchemaNames } from '../../lib/database/schema'
import { verifyJWTToken } from '../../lib/jwt/index'
import { sortObjArr } from '../../lib/utils/array'
import catchError from './utils/wrapper/catchError'

// post
async function retrieveCommentsByCommentIds(req: NextApiRequest, res: NextApiResponse) {
  const {
    commentIds
  } = req.body
  const accountModel = await retrieveAccountModel()
  const commentModel = await retrieveCommentModel()
  const rawComments = (
    await commentModel.find({
      _id: commentIds
    }).populate('replyTo.replyToCommentId')
      .populate('replyTo.replyToAccountId')
  ).map(item => ({
    ...item.toObject(),
    ['orderHelperKey']: (item._id).toString()
  }))
  const rawCommentsOrdered = sortObjArr( rawComments, {
    sortField: 'orderHelperKey',
    order: commentIds
  })
  const comments = await Promise.all(
    rawCommentsOrdered.map(async item => {
      const commenter = await accountModel.findOne({
        _id: item.commenterId
      })
      const result = {
        id: item._id,
        content: item.content,
        createTime: item.createTime,
        likeNumber: item.like,
        isReply: !!item.replyTo,
        replyTo: item.replyTo,
        replyNumber: item.reply ? (item.reply.length + item.replyReply?.length ?? 0) : 0,
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
  )
  // console.log({
  //   comments: JSON.stringify(comments)
  // })
  res.status(200).json({
    code: 0,
    msg: 'success',
    data: {
      comments
    }
  })
}

export default catchError(retrieveCommentsByCommentIds)