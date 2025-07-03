import { Router } from "express";
import { findAll } from "../controller/find";
import { create } from "../controller/save";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const personas = await findAll();
    res.status(200).json({
      personas,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, label, personaUrl } = req.body;
    if (!name) {
      const error = Error("Bad requests");
      (error as any).statusCode = 400;
      throw error;
    }
    const persona = await create(name, label, personaUrl);
    res.status(201).json({
      persona,
    });
  } catch (err) {
    next(err);
  }
});

export { router };
