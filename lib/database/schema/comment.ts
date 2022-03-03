import mongoose from "mongoose"
import { SchemaNames } from './type'

export interface Comment {
  _id: string,
  commenterId: string,
  replyTo?: { replyToCommentId: mongoose.Types.ObjectId, replyToAccountId: mongoose.Types.ObjectId }, // true - 一级评论； false - 回复、回复的回复
  content: string,
  createTime: number,
  like: number,
  reply: Array<string> // comment id array
}
const commentSchema = {
  _id: mongoose.Types.ObjectId,
  commenterId: mongoose.Types.ObjectId,
  content: String,
  createTime: Number,
  like: Number,
  reply: Array // comment id array
}
export const CommentSchema = {
  name: SchemaNames.comment,
  schema : new mongoose.Schema(commentSchema)
}
