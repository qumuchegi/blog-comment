import mongoose from 'mongoose'
import {
  AccountSchema, Account,
  CommentSchema, Comment,
  CommentClusterSchema, Cluster,
  SchemaNames
} from './schema'

const createConnect = async (mongodbUrl: string) => {
  return mongoose.connect(mongodbUrl)
}

const dbUrl = process.env.mongodbUrl as string

async function initDb(mongodbUrl: string) {
  console.log({mongodbUrl})
  const connect = await createConnect(mongodbUrl)
  console.log({connect})
  await createAccountModel()
  await createCommentModel()
  await createCommentClusterModel()
  console.log('数据库初始化完毕')
  return true
}

const createModel = <T>(modelName: SchemaNames, schema: mongoose.Schema) => {
  mongoose.model<T>(modelName, schema)
}
const retrieveModel = async <T>(modelName: SchemaNames): mongoose.Model<T> => {
  await initDb(dbUrl)
  return mongoose.model<T>(modelName)
}

const retrieveAccountModel = () => {
  return retrieveModel<Account>(SchemaNames.account)
}

const createAccountModel = () => {
  return createModel<Account>(
    SchemaNames.account,
    new mongoose.Schema(AccountSchema.schema)
  )
}

const retrieveCommentModel = () => {
  return retrieveModel<Comment>(SchemaNames.comment)
}

const createCommentModel = () => {
  return createModel<Comment>(
    SchemaNames.comment,
    new mongoose.Schema(CommentSchema.schema)
  )
}

const retrieveClusterModel = () => {
  return retrieveModel<Cluster>(SchemaNames.commentCluster)
}

const createCommentClusterModel = () => {
  return createModel<Cluster>(
    SchemaNames.commentCluster,
    new mongoose.Schema(CommentClusterSchema.schema)
  )
}

export {
  retrieveAccountModel,
  retrieveCommentModel,
  retrieveClusterModel
}
