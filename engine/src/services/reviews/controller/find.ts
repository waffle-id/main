import { ReviewModel } from "../model";

export async function findByRevieweeUsernameAndReviewerUsername(
  revieweeUsername: string,
  reviewerUsername: string
) {
  return ReviewModel.findOne({ revieweeUsername, reviewerUsername });
}

export async function findAllByRevieweeUsername(revieweeUsername: string) {
  return ReviewModel.find({ revieweeUsername });
}

export async function findAllByReviewerUsername(reviewerUsername: string) {
  return ReviewModel.find({ reviewerUsername });
}
