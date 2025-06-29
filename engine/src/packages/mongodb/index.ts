import CONFIG from "@/config";
import mongoose from "mongoose";

mongoose.set("strictQuery", false);
const mongoConnect = () => {
  return mongoose.connect(CONFIG.MONGO_URI);
};

export { mongoConnect };
