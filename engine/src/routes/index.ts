import { Router } from "express";
import { router as AccountServices } from "@services/account";
import { router as ReviewRoutes } from "@services/reviews";
import { router as BadgesServices } from "@services/badges";
import { router as PersonaServices } from "@services/personas";
import { router as ReferralServices } from "@services/referral-codes";
import { router as CategoriesServices } from "@services/categories";

const router = Router();

router.use((req, res, next) => {
  console.log({ url: req.url });
  next();
});

router.use("/account", AccountServices);
router.use("/reviews", ReviewRoutes);
router.use("/badges", BadgesServices);
router.use("/personas", PersonaServices);
router.use("/referral-codes", ReferralServices);
router.use("/categories", CategoriesServices);
router.get("/waffle", (req, res) => {
  res.json({ stat: "hi Waffle! " + new Date().toISOString() });
});

export { router as GlobalRouter };
