import { Router } from "express";
import { findAllBadges } from "../controller/find";

const router = Router();

router.get("/", async (req, res) => {
  const items = await findAllBadges();

  res.json({
    data: items,
  });
});

export { router };
