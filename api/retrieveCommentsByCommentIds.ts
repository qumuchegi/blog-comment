import { NextApiRequest, NextApiResponse } from 'next'
import { initDb } from '../lib/database/index'
import { verifyJWTToken } from '../lib/jwt/index'
import catchError from '../api/utils/wrapper/catchError'

async function retrieveCommentsByCommentIds(req: NextApiRequest, res: NextApiResponse) {
  const {
    dbUrlToken,
    commentIds = []
  } = req.body
  const dbUrl = verifyJWTToken(dbUrlToken).dbUrl
  const models =  await initDb(dbUrl)
  const accountModel = models['AccountSchema']
  const commentModel = models['CommentSchema']
  const rawComments = await commentModel.find({
    _id: commentIds
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
      replyNumber: item.reply ? item.reply.length : 0,
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

export default catchError(retrieveCommentsByCommentIds)