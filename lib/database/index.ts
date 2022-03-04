import mongoose from 'mongoose'
import {
  AccountSchema, Account,
  CommentSchema, Comment,
  CommentClusterSchema, Cluster,
  SchemaNames
} from './schema'

const dbUrl = process.env.mongodbUrl as string

if (!dbUrl) {
  throw new Error('process.env.mongodbUrl 为空')
}

//@ts-ignore
let cached = global.mongoose

if (!cached) {
  //@ts-ignore
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(dbUrl, opts).then((mongoose) => {
      return mongoose
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

async function initDb() {
  await dbConnect()
  console.log('数据库连接成功')
}

const createModel = <T>(modelName: SchemaNames, schema: mongoose.Schema) => {
  return mongoose.model<T>(modelName, schema)
}

const retrieveModel = async <T>(modelName: SchemaNames, schema: mongoose.Schema): mongoose.Model<T> => {
  await initDb()
  return mongoose.models[modelName] || createModel<T>(modelName, schema)
}

const retrieveAccountModel = () => {
  return retrieveModel<Account>(SchemaNames.account, new mongoose.Schema(AccountSchema.schema))
}

const retrieveCommentModel = () => {
  return retrieveModel<Comment>(SchemaNames.comment, new mongoose.Schema(CommentSchema.schema))
}

const retrieveClusterModel = () => {
  return retrieveModel<Cluster>(SchemaNames.commentCluster, new mongoose.Schema(CommentClusterSchema.schema))
}

export {
  retrieveAccountModel,
  retrieveCommentModel,
  retrieveClusterModel
}
