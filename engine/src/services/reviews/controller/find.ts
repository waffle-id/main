import { ReviewModel } from "../model";

export async function findByRevieweeUsernameAndReviewerUsername(
  revieweeUserName: string,
  reviewerUsername: string
) {
  return ReviewModel.findOne({ revieweeUserName, reviewerUsername });
}
