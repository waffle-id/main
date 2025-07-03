import { ReferralCodeModel } from "../model";

export async function update(referralCode: any) {
  return referralCode.save();
}

export async function create(code: string) {
  return ReferralCodeModel.create({
    code,
    isExpired: false,
  });
}

export async function updateByCode(
  code: string,
  data: Partial<{ isExpired: boolean }>
) {
  const result = await ReferralCodeModel.findOneAndUpdate(
    { code },
    { $set: data },
    { new: true } // return the updated document
  );
  return result; // null if not found
}
