import { Schema, Document, model } from "mongoose";

const TABLE_REFERRAL_CODE = "referral_codes";

const ReferralCodeSchema: Schema = new Schema(
  {
    code: { type: String, required: true },
    isExpired: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

export const ReferralCodeModel = model(
  TABLE_REFERRAL_CODE,
  ReferralCodeSchema,
  TABLE_REFERRAL_CODE
);
