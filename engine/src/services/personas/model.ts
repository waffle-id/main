import { Schema, Document, model } from "mongoose";

const TABLE_PERSONA = "personas";

const PersonaSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    label: { type: String, required: false },
    personaUrl: { type: String, require: false },
  },
  {
    timestamps: true,
  }
);

export const PersonaModel = model(TABLE_PERSONA, PersonaSchema, TABLE_PERSONA);
