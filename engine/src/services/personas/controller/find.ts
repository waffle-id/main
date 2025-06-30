import { PersonaModel } from "../model";

export async function findByName(name: string) {
  return PersonaModel.findOne({ name });
}
