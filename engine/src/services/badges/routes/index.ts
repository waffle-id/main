import { Router } from "express";
import { findAllBadges } from "../controller/find";

const router = Router();

router.get("/", async (req, res) => {
  const items = findAllBadges();

  res.json(items);
});

export { router };
