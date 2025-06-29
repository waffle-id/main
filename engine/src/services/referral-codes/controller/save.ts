import { ReferralCodeModel } from "../model";

export async function update(referralCode: any) {
  return referralCode.save();
}
