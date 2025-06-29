import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV != "production" ? ".env" : ".env.production",
});

const CONFIG = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 7000,
  MONGO_URI: process.env.MONGO_URI || "",
  RABBITMQ_URI: process.env.RABBITMQ_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "supersecretkey",
  JTW_EXPIRY: process.env.JWT_EXPIRY || "1h",
};

export { CONFIG };
export default CONFIG;
