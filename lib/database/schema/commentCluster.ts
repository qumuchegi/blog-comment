import mongoose from "mongoose"
import { SchemaNames } from './type'

export interface Cluster {
  id: string,
  comments: Array<{id: string, isTopComment: boolean,}> // comment id array
}
const clusterSchema = {
  // _id: mongoose.Schema.Types.ObjectId,
  isTopComment: Boolean,
  comments: Array // comment id array
}
export const CommentClusterSchema = {
  name: SchemaNames.commentCluster,
  schema : new mongoose.Schema(clusterSchema)
}
