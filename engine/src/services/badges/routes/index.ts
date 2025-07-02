import { Router } from "express";
import { findAllBadges } from "../controller/find";

const router = Router();

router.get("/", async (req, res) => {
  const items = findAllBadges();

  res.json({
    data: items,
  });
});

export { router };
