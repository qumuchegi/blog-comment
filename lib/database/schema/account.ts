import mongoose from "mongoose"
import { SchemaNames } from './type'

export enum AccountType {
  Anonymous,
  github
}
export interface Account {
  _id: string,
  customId: string,
  accountType: AccountType,
  userName: string,
  email?: string,
  url?: string,
  avatar?: string
}
const accountSchema = {
  // _id: mongoose.Schema.Types.ObjectId,
  customId: String,
  accountType: Number,
  userName: { type: String, required: true },
  email: String,
  url: String,
  avatar: String
}
export const AccountSchema = {
  name: SchemaNames.account,
  schema : accountSchema
}
