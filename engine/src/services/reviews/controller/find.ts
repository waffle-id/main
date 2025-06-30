import { ReviewModel } from "../model";

export async function findByRevieweeUsernameAndReviewerUsername(
  revieweeUsername: string,
  reviewerUsername: string
) {
  return ReviewModel.findOne({ revieweeUsername, reviewerUsername });
}
