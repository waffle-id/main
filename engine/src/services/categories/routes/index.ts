import { Router } from "express";
import { findAllCategories } from "../controller/find";

const router = Router();

router.get("/", async (req, res) => {
  const items = await findAllCategories();

  res.json({
    data: items,
  });
});

export { router };
