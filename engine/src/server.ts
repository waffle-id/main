import "express-async-errors";

import express from "express";
import cors from "cors";
import CONFIG from "./config";
import { GlobalRouter } from "./routes";
import expressWs from "express-ws";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(
  express.json({
    limit: "100mb",
  })
);

/* ------------------------------ custom routes ----------------------------- */

app.use(GlobalRouter);
app.use(errorHandler);
/* -------------------------- end of custom routes -------------------------- */

app.get("/", (req, res) => {
  res.json({
    status: `Waffle!`,
  });
});

app.use("*", (req, res) => {
  res.status(400);
  res.json({
    url: req.url,
    message: "Not Found",
  });
});

export async function runServer() {
  app.listen(CONFIG.PORT, () => {
    console.log(`Listening on port: `, CONFIG.PORT);
  });
  return app;
}

export { app };
