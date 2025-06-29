import { Router } from "express";
import { router as AccountServices } from "@services/account";
import { router as TrxServices } from "@services/transaction";
import { router as DevRoutes } from "@services/dev-mode";

const router = Router();

router.use((req, res, next) => {
  console.log({ url: req.url });
  next();
});

router.use("/account", AccountServices);
router.use("/trx", TrxServices);
router.use("/dev", DevRoutes);

export { router as GlobalRouter };
