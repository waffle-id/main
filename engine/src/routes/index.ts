import { Router } from "express";
import { router as AccountServices } from "@services/account";
import { router as ReviewRoutes } from "@services/reviews";

const router = Router();

router.use((req, res, next) => {
  console.log({ url: req.url });
  next();
});

router.use("/account", AccountServices);
router.use("/reviews", ReviewRoutes);
router.get("/waffle", (req, res) => {
  res.json({ stat: "hi Waffle! " + new Date().toISOString() });
});

export { router as GlobalRouter };
