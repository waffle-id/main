import { Schema, Document, model } from "mongoose";

const TABLE_ACCOUNT = "accounts";

const UserSchema: Schema = new Schema(
  {
    address: { type: String, required: false },
    username: { type: String, required: true, unique: true },
    fullName: { type: String, required: false },
    bio: { type: String, required: false },
    avatarUrl: { type: String, required: false },
    reputationScore: { type: Number, required: true },
    hasInvitationAuthority: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model(TABLE_ACCOUNT, UserSchema, TABLE_ACCOUNT);
