import { Schema, Document, model } from "mongoose";

const TABLE_ACCOUNT = "accounts";

const AccountSchema: Schema = new Schema(
  {
    address: { type: String, required: true },
    username: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model(TABLE_ACCOUNT, AccountSchema, TABLE_ACCOUNT);
