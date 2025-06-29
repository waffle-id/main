import { Schema, Document, model } from "mongoose";

const TABLE_ACCOUNT = "accounts";

const UserSchema: Schema = new Schema(
  {
    address: { type: String, required: false },
    username: { type: String, required: true },
    reputationScore: { type: Number, required: true },
    hasInvitationAuthority: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model(TABLE_ACCOUNT, UserSchema, TABLE_ACCOUNT);
