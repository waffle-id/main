import { Schema, Document, model } from "mongoose";

const TABLE_REVIEW = "reviews";

const ReviewSchema: Schema = new Schema(
  {
    reviewerUsername: { type: String, required: true },
    revieweeUsername: { type: String, required: true },
    comment: { type: String, require: true },
    txHash: { type: String, require: true },
    rating: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

export const ReviewModel = model(TABLE_REVIEW, ReviewSchema, TABLE_REVIEW);
