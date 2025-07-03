import { PersonaModel } from "../model";

export async function create(
  name: string,
  label: string | null,
  personaUrl: string | null
) {
  return PersonaModel.create({
    name,
    label,
    personaUrl,
  });
}
