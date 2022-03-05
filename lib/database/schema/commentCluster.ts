import mongoose from "mongoose"
import { SchemaNames } from './type'

export interface Cluster {
  clusterId: string,
  comments: Array<{id: string, isTopComment: boolean,}> // comment id array
}
const clusterSchema = {
  // _id: mongoose.Schema.Types.ObjectId,
  clusterId: String,
  comments: Array // comment id array
}
export const CommentClusterSchema = {
  name: SchemaNames.commentCluster,
  schema : clusterSchema
}
