import { Router } from "express";
import { authMiddleware } from "../../../middleware/authMiddleware";
import {
  findAllByRevieweeUsername,
  findAllByReviewerUsername,
  findByRevieweeUsernameAndReviewerUsername,
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
import { update as updateUser } from "@/services/account/controller/save";
const router = Router();

interface ReviewRequestBody {
  comment?: string;
  txHash?: string;
  personas?: { name: string; weight: number }[];
  rating?: ReviewRating;
  overallPersona?: string; // can be kept for future use
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

// GET /reviews?revieweeUsername=alice
// GET /reviews?reviewerUsername=bob
router.get("/", async (req, res, next) => {
  try {
    const { revieweeUsername, reviewerUsername } = req.query;

    if (!revieweeUsername && !reviewerUsername) {
      const error = Error("Either revieweeUsername or reviewerUsername is required");
      (error as any).statusCode = 400;
      throw error;
    }

    let reviews;
    if (revieweeUsername) {
      reviews = await findAllByRevieweeUsername(revieweeUsername as string);
    } else {
      reviews = await findAllByReviewerUsername(reviewerUsername as string);
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
