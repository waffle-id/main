import { Router } from "express";
import { authMiddleware } from "../../../middleware/authMiddleware";
import {
  findAllByRevieweeUsername,
  findAllByReviewerUsername,
  findByRevieweeUsernameAndReviewerUsername,
  findAllByRevieweeAddress,
  findAllByReviewerAddress,
  findByRevieweeAddressAndReviewerAddress,
} from "../controller/find";
import { findByName } from "@/services/personas/controller/find";
import { PersonaRequest } from "@/types/Persona";
import { findByUsernameAndPersonaName } from "@/services/user-persona-scores/controller/find";
import {
  create as createPersonaScore,
  update as updatePersonaScore,
} from "@/services/user-persona-scores/controller/save";
import { create as createReview } from "@/services/reviews/controller/save";
import { findByUsernameFullData } from "@/services/account/controller/find";
import { findByAddressFullData } from "@/services/account/controller/find";
import { update as updateUser } from "@/services/account/controller/save";
const router = Router();

interface ReviewRequestBody {
  comment?: string;
  txHash?: string;
  personas?: { name: string; weight: number }[];
  rating?: ReviewRating;
  overallPersona?: string;
}

export type ReviewRating = "positive" | "neutral" | "negative";

router.post("/:revieweeUsername", authMiddleware, async (req, res, next) => {
  try {
    const { revieweeUsername } = req.params;
    const { comment, txHash, personas, overallPersona, rating } = req.body;
    const { id, address, username } = (req as any).user;
    console.log(`username is: ${username}`);

    if (!comment || !txHash || !overallPersona || !rating) {
      const error = Error("Bad requests");
      (error as any).statusCode = 400;
      throw error;
    }

    // Can't review self
    // if (username === revieweeUsername) {
    //   const error = Error("You can't review yourself");
    //   (error as any).statusCode = 400;
    //   throw error;
    // }

    // Check if reviewer has reviewed the target, if yes, throw
    // const existingReview = await findByRevieweeUsernameAndReviewerUsername(
    //   revieweeUsername,
    //   username
    // );
    // console.log(`review is: ${existingReview}`);
    // if (existingReview) {
    //   const error = Error("You can't review this person anymore");
    //   (error as any).statusCode = 400;
    //   throw error;
    // }
    await createReview(txHash, comment, username, revieweeUsername, rating);

    const baseScore = 10;

    const reviewee = await findByUsernameFullData(revieweeUsername);
    if (!reviewee) {
      const error = Error("This user doesn't exist");
      (error as any).statusCode = 404;
      throw error;
    }
    if (rating === "positive") {
      reviewee.reputationScore = (reviewee.reputationScore as any) + 1;
    } else if (rating === "negative") {
      reviewee.reputationScore = (reviewee.reputationScore as any) - 1;
    }
    await updateUser(reviewee);

    for (const persona of personas || []) {
      const existingPersona = await findByName(persona.name);
      if (!existingPersona) {
        const error = Error("Persona is not found");
        (error as any).statusCode = 404;
        throw error;
      }
      let existingPersonaScore = await findByUsernameAndPersonaName(revieweeUsername, persona.name);
      if (!existingPersonaScore) {
        existingPersonaScore = await createPersonaScore({
          username: revieweeUsername,
          personaName: persona.name,
          score: 0,
        });
      }
      existingPersonaScore.score =
        (existingPersonaScore.score as any) + (baseScore * persona.weight) / 100;
      await updatePersonaScore(existingPersonaScore);
    }
    res.status(201).json({
      isSuccess: true,
    });
  } catch (err) {
    next(err);
  }
});

// POST /reviews/address/:revieweeAddress - Review by wallet address
router.post("/address/:revieweeAddress", authMiddleware, async (req, res, next) => {
  try {
    const { revieweeAddress } = req.params;
    const { comment, txHash, personas, overallPersona, rating } = req.body;
    const { id, address, username } = (req as any).user;
    console.log(`reviewer username is: ${username}`);

    if (!comment || !txHash || !overallPersona || !rating) {
      const error = Error("Bad requests");
      (error as any).statusCode = 400;
      throw error;
    }

    // Find reviewee by address
    const reviewee = await findByAddressFullData(revieweeAddress);
    if (!reviewee) {
      const error = Error("This address doesn't exist in our system");
      (error as any).statusCode = 404;
      throw error;
    }

    const revieweeUsername = reviewee.username as string;

    // Can't review self
    // if (username === revieweeUsername) {
    //   const error = Error("You can't review yourself");
    //   (error as any).statusCode = 400;
    //   throw error;
    // }

    // Check if reviewer has reviewed the target, if yes, throw
    // const existingReview = await findByRevieweeUsernameAndReviewerUsername(
    //   revieweeUsername,
    //   username
    // );
    // if (existingReview) {
    //   const error = Error("You can't review this person anymore");
    //   (error as any).statusCode = 400;
    //   throw error;
    // }

    await createReview(txHash, comment, username, revieweeUsername, rating);

    const baseScore = 10;

    if (rating === "positive") {
      reviewee.reputationScore = (reviewee.reputationScore as any) + 1;
    } else if (rating === "negative") {
      reviewee.reputationScore = (reviewee.reputationScore as any) - 1;
    }
    await updateUser(reviewee);

    for (const persona of personas || []) {
      const existingPersona = await findByName(persona.name);
      if (!existingPersona) {
        const error = Error("Persona is not found");
        (error as any).statusCode = 404;
        throw error;
      }
      let existingPersonaScore = await findByUsernameAndPersonaName(revieweeUsername, persona.name);
      if (!existingPersonaScore) {
        existingPersonaScore = await createPersonaScore({
          username: revieweeUsername,
          personaName: persona.name,
          score: 0,
        });
      }
      existingPersonaScore.score =
        (existingPersonaScore.score as any) + (baseScore * persona.weight) / 100;
      await updatePersonaScore(existingPersonaScore);
    }
    res.status(201).json({
      isSuccess: true,
    });
  } catch (err) {
    next(err);
  }
});

// GET /reviews?revieweeUsername=alice
// GET /reviews?reviewerUsername=bob
// GET /reviews?revieweeAddress=0x123...
// GET /reviews?reviewerAddress=0x456...
router.get("/", async (req, res, next) => {
  try {
    const { revieweeUsername, reviewerUsername, revieweeAddress, reviewerAddress } = req.query;

    if (!revieweeUsername && !reviewerUsername && !revieweeAddress && !reviewerAddress) {
      const error = Error("Either revieweeUsername, reviewerUsername, revieweeAddress, or reviewerAddress is required");
      (error as any).statusCode = 400;
      throw error;
    }

    let reviews;
    if (revieweeUsername) {
      reviews = await findAllByRevieweeUsername(revieweeUsername as string);
    } else if (reviewerUsername) {
      reviews = await findAllByReviewerUsername(reviewerUsername as string);
    } else if (revieweeAddress) {
      reviews = await findAllByRevieweeAddress(revieweeAddress as string);
    } else if (reviewerAddress) {
      reviews = await findAllByReviewerAddress(reviewerAddress as string);
    }

    res.status(200).json({
      isSuccess: true,
      reviews,
    });
  } catch (err) {
    next(err);
  }
});

export { router };
