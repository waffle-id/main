import { ReferralCodeModel } from "../model";

export async function findByCode(code: string) {
  return await ReferralCodeModel.findOne({ code });
}

export async function deleteByCode(code: string) {
  const result = await ReferralCodeModel.findOneAndDelete({ code });
  return result; // null if not found
}
