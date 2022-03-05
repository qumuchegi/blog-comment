import { NextApiRequest, NextApiResponse } from 'next'
import {
  retrieveCommentModel
} from '../../lib/database/index'
import catchError from './utils/wrapper/catchError'

async function likeComment(req: NextApiRequest, res: NextApiResponse) {
  const {
    commentId
  } = req.body
  const commentModel = await retrieveCommentModel()
  await commentModel.findByIdAndUpdate(
    commentId,
    {
      $inc: {
        like: 1
      }
    }
  )
  res.status(200).json({
    code: 0,
    msg: 'success',
    data: null
  })
}
export default catchError(likeComment)