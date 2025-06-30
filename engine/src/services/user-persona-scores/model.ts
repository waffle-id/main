import { Schema, Document, model } from "mongoose";

const TABLE_USER_PERSONA_SCORE = "user_persona_scores";

const UserPersonaScoreSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    personaName: { type: String, required: true },
    score: { type: Number, require: true },
  },
  {
    timestamps: true,
  }
);

export const UserPersonaScoreModel = model(
  TABLE_USER_PERSONA_SCORE,
  UserPersonaScoreSchema,
  TABLE_USER_PERSONA_SCORE
);
