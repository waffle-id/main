import { Router } from "express";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { findByRevieweeUsernameAndReviewerUsername } from "../controller/find";
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

router.post("/:revieweeUserName", authMiddleware, async (req, res, next) => {
  try {
    const { revieweeUserName } = req.params;
    const { comment, txHash, personas, overallPersona } = req.body;
    const { id, address, username } = (req as any).user;

    // Check if reviewer has reviewed the target, if yes, throw
    const existingReview = await findByRevieweeUsernameAndReviewerUsername(
      revieweeUserName,
      username
    );
    if (existingReview) {
      const error = Error("You can't review this person anymore");
      (error as any).statusCode = 400;
      throw error;
    }
    await createReview(txHash, comment, username, revieweeUserName);

    const baseScore = 10;

    const reviewee = await findByUsernameFullData(revieweeUserName);
    if (!reviewee) {
      const error = Error("This user doesn't exist");
      (error as any).statusCode = 404;
      throw error;
    }
    if (overallPersona.toLowerCase() === "risky") {
      reviewee.reputationScore = (reviewee.reputationScore as any) - 1;
    } else {
      reviewee.reputationScore = (reviewee.reputationScore as any) + 1;
    }
    await updateUser(reviewee);

    personas.array.forEach(async (persona: PersonaRequest) => {
      const existingPersona = await findByName(persona.name);
      if (!existingPersona) {
        const error = Error("Persona is not found");
        (error as any).statusCode = 404;
        throw error;
      }
      let existingPersonaScore = await findByUsernameAndPersonaName(
        revieweeUserName,
        persona.name
      );
      if (!existingPersonaScore) {
        existingPersonaScore = await createPersonaScore({
          username: revieweeUserName,
          personaName: persona.name,
          score: 0,
        });
      }
      existingPersonaScore.score =
        (existingPersonaScore.score as any) + baseScore * persona.weight;
      await updatePersonaScore(existingPersonaScore);
    });
    res.status(201).json({
      isSuccess: true,
    });
  } catch (err) {
    next(err);
  }
});

export { router };
