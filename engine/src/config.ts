import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV != "production" ? ".env" : ".env.production",
});

const CONFIG = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 3000,
  MONGO_URI: process.env.MONGO_URI || "",
  RABBITMQ_URI: process.env.RABBITMQ_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "supersecretkey",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "1h",
} as const;

export { CONFIG };
export default CONFIG;
