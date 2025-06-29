import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    tokenType: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    mediashare: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "out",
      enum: ["out", "in"],
    },
    transactionHash: {
      type: String,
      required: true,
      unique: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
