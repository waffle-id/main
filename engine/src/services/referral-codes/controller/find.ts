import { ReferralCodeModel } from "../model";

export async function findByCode(code: string) {
  return await ReferralCodeModel.findOne({ code });
}
