import { ReviewModel } from "../model";

export async function create(
  txHash: string,
  comment: string,
  reviewerUsername: string,
  revieweeUsername: string
) {
  return ReviewModel.create({
    txHash,
    revieweeUsername,
    reviewerUsername,
    comment,
  });
}
