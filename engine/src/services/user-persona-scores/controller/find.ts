import { UserPersonaScoreModel } from "../model";

export async function findByUsernameAndPersonaName(
  username: string,
  personaName: string
) {
  return UserPersonaScoreModel.findOne({
    username,
    personaName: new RegExp(`^${personaName}$`, "i"),
  });
}

export async function findAllByUsername(username: string) {
  return UserPersonaScoreModel.find({
    username,
  });
}
