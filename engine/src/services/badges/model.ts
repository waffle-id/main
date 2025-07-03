import { Schema, Document, model } from "mongoose";

const TABLE_BADGES = "badges";

const BadgeSchema: Schema = new Schema(
  {
    title: { type: String, required: false },
    desc: { type: String, required: false },
    images: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export const BadgeModel = model(TABLE_BADGES, BadgeSchema, TABLE_BADGES);
