import mongoose from "mongoose"
import { SchemaNames } from './type'

export interface Comment {
  _id: string,
  commenterId: string,
  replyTo?: {
    // 填充（联表）
    replyToCommentId: string,
    replyToAccountId: string
  }
  // replyTo?: { replyToCommentId: string, replyToAccountId: string }, // true - 一级评论； false - 回复、回复的回复
  content: string,
  createTime: number,
  like: number,
  reply: Array<string> // 直接回复 comment id array
  replyReply: Array<string>// 间接回复，这条评论下回复的回复
}
const commentSchema = {
  // _id: mongoose.Schema.Types.ObjectId,
  commenterId: mongoose.Types.ObjectId,
  replyTo: {
    type: {
      replyToCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: SchemaNames.comment
      },
      replyToAccountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: SchemaNames.account
      }
    },
    required: false
  },
  content: String,
  createTime: Number,
  like: Number,
  reply: Array, // comment id array
  replyReply: Array // comment id array
}
export const CommentSchema = {
  name: SchemaNames.comment,
  schema : commentSchema
}
