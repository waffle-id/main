import { UserPersonaScoreModel } from "../model";

export async function create({
  username,
  personaName,
  score,
}: {
  username: string;
  personaName: string;
  score: number;
}) {
  return UserPersonaScoreModel.create({ username, personaName, score });
}

export async function update(userPersonaScore: any) {
  userPersonaScore.save();
}
