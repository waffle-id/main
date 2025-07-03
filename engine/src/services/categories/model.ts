import { Schema, Document, model } from "mongoose";

const TABLE_CATEGORIES = "categories";

const CategoriesSchema: Schema = new Schema(
  {
    title: { type: String, required: false },
    desc: { type: String, required: false },
    images: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export const CategoriesModel = model(TABLE_CATEGORIES, CategoriesSchema, TABLE_CATEGORIES);
