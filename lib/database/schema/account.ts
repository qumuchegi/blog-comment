import mongoose from "mongoose"
import { SchemaNames } from './type'

export interface Account {
  _id: string,
  userName: string,
  email?: string,
  url?: string,
  avatar?: string
}
const accountSchema = {
  // _id: mongoose.Schema.Types.ObjectId,
  userName: { type: String, required: true },
  email: String,
  url: String,
  avatar: String
}
export const AccountSchema = {
  name: SchemaNames.account,
  schema : new mongoose.Schema<Account>(accountSchema)
}
