import { PersonaModel } from "../model";

export async function findByName(name: string) {
  return PersonaModel.findOne({ name: new RegExp(`^${name}$`, "i") });
}

export async function findAll() {
  return PersonaModel.find();
}
