import mongoose from 'mongoose'
import {
  AccountSchema, Account,
  CommentSchema, Comment,
  CommentClusterSchema, Cluster,
  SchemaNames
} from './schema'

const createConnect = (mongodbUrl: string) => {
  const connectPromise = mongoose.connect(mongodbUrl)
  return connectPromise
}

const retrieveModel = <T>(modelName: SchemaNames, schema: mongoose.Schema): mongoose.Model<T> => {
  return mongoose.model(modelName, schema)
}

const retrieveAccountModel = () => {
  return retrieveModel<Account>(
    SchemaNames.account,
    new mongoose.Schema(AccountSchema)
  )
}

const retrieveCommentModel = () => {
  return retrieveModel<Comment>(
    SchemaNames.comment,
    new mongoose.Schema(CommentSchema)
  )
}

const retrieveCommentClusterModel = () => {
  return retrieveModel<Cluster>(
    SchemaNames.commentCluster,
    new mongoose.Schema(CommentClusterSchema)
  )
}

async function initDb(mongodbUrl: string) {
  await createConnect(mongodbUrl)
  return {
    [SchemaNames.account]: await retrieveAccountModel(),
    [SchemaNames.comment]: await retrieveCommentModel(),
    [SchemaNames.commentCluster]: await retrieveCommentClusterModel(),
  }
}

export {
  initDb
}

/**
 * mongodb+srv://chegi_mongodb:113322cg@cluster0.2spu1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
 */
