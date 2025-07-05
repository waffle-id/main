import { ReviewModel } from "../model";

export async function findByRevieweeUsernameAndReviewerUsername(
  revieweeUsername: string,
  reviewerUsername: string
) {
  return ReviewModel.findOne({ revieweeUsername, reviewerUsername });
}

export async function findAllByRevieweeUsername(revieweeUsername: string) {
  return ReviewModel.aggregate([
    { $match: { revieweeUsername } },
    {
      $lookup: {
        from: "accounts",
        localField: "reviewerUsername",
        foreignField: "username",
        as: "reviewerAccount",
      },
    },
    { $unwind: { path: "$reviewerAccount", preserveNullAndEmptyArrays: true } },
  ]);
}

export async function findAllByReviewerUsername(reviewerUsername: string) {
  return ReviewModel.aggregate([
    { $match: { reviewerUsername } },
    {
      $lookup: {
        from: "accounts",
        localField: "revieweeUsername",
        foreignField: "username",
        as: "revieweeAccount",
      },
    },
    { $unwind: { path: "$reviewerAccount", preserveNullAndEmptyArrays: true } },
  ]);
}
