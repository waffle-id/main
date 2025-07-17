import { ReviewModel } from "../model";
import { findByAddress } from "../../account/controller/find";

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
    { $sort: { createdAt: -1 } },
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
    { $sort: { createdAt: -1 } },
  ]);
}

export async function findAllByRevieweeAddress(revieweeAddress: string) {
  const revieweeAccount = await findByAddress(revieweeAddress);
  if (!revieweeAccount) {
    return [];
  }

  return ReviewModel.aggregate([
    { $match: { revieweeUsername: revieweeAccount.username } },
    {
      $lookup: {
        from: "accounts",
        localField: "reviewerUsername",
        foreignField: "username",
        as: "reviewerAccount",
      },
    },
    { $unwind: { path: "$reviewerAccount", preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: -1 } },
  ]);
}

export async function findAllByReviewerAddress(reviewerAddress: string) {
  const reviewerAccount = await findByAddress(reviewerAddress);
  if (!reviewerAccount) {
    return [];
  }

  return ReviewModel.aggregate([
    { $match: { reviewerUsername: reviewerAccount.username } },
    {
      $lookup: {
        from: "accounts",
        localField: "revieweeUsername",
        foreignField: "username",
        as: "revieweeAccount",
      },
    },
    { $unwind: { path: "$revieweeAccount", preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: -1 } },
  ]);
}

export async function findByRevieweeAddressAndReviewerAddress(
  revieweeAddress: string,
  reviewerAddress: string
) {
  const revieweeAccount = await findByAddress(revieweeAddress);
  const reviewerAccount = await findByAddress(reviewerAddress);

  if (!revieweeAccount || !reviewerAccount) {
    return null;
  }

  return ReviewModel.findOne({
    revieweeUsername: revieweeAccount.username,
    reviewerUsername: reviewerAccount.username,
  });
}

export const getReviewsWrittenByUserCount = async (usernames: string[]) => {
  return await ReviewModel.aggregate([
    { $match: { reviewerUsername: { $in: usernames } } },
    { $group: { _id: "$reviewerUsername", count: { $sum: 1 } } },
  ]);
};

export const getReviewsReceivedByUserCount = async (usernames: string[]) => {
  return await ReviewModel.aggregate([
    { $match: { revieweeUsername: { $in: usernames } } },
    { $group: { _id: "$revieweeUsername", count: { $sum: 1 } } },
  ]);
};
