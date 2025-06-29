import { Router } from "express";
import {
  getAllTransactions,
  getTransactionById,
  getTransactionsByCreator,
} from "../controller/find";
import { createTransaction } from "../controller/create";
import { sendToTopic } from "@/packages/rabbitmq";
import { findByAddress } from "@/services/account/controller/find";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, creator, from } = req.query;
    const query: any = {};

    if (creator) query.creator = creator;
    if (from) query.from = from;

    const transactions = await getAllTransactions(query, Number(limit), Number(page));

    res.json(transactions);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch transactions",
    });
  }
});

router.get("/summary/:address", async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const { address } = req.params;

    if (!address) {
      throw new Error("Field address is required");
    }

    let transactions;
    transactions = await getAllTransactions(
      {
        $or: [{ creator: address }, { from: address }],
      },
      Number(limit),
      Number(page)
    );

    console.log(transactions);

    res.json(transactions);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch transactions",
    });
  }
});

router.get("/:address/:type", async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const { type, address } = req.params;

    if (!type || !address) {
      throw new Error("Field type, address is required");
    }

    if (type == "in" || type == "out") {
      let transactions;
      if (type == "in") {
        transactions = await getAllTransactions(
          {
            // type: "in",
            creatorAddress: address,
          },
          Number(limit),
          Number(page)
        );
      } else {
        transactions = await getAllTransactions(
          {
            type: "out",
            from: address,
          },
          Number(limit),
          Number(page)
        );
      }

      res.json(transactions);
    } else {
      throw new Error("Transaction type is required");
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch transactions",
    });
  }
});

// router.get("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       throw new Error("Transaction ID is required");
//     }

//     const transaction = await getTransactionById(id);

//     if (!transaction) {
//       throw new Error("Transaction not found");
//     }

//     res.json(transaction);
//   } catch (error: any) {
//     res.status(error.message === "Transaction not found" ? 404 : 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });

router.get("/creator/:creator", async (req, res) => {
  try {
    const { creator } = req.params;
    const { limit = 10, page = 1 } = req.query;

    if (!creator) {
      throw new Error("Creator address is required");
    }

    const transactions = await getTransactionsByCreator(creator, Number(limit), Number(page));

    res.json(transactions);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch transactions",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { amount, tokenType, creator, from, fromAddress, message, mediashare, transactionHash } =
      req.body;

    if (!amount || !tokenType || !creator || !from || !transactionHash) {
      throw new Error("Missing required fields");
    }

    const transaction = await createTransaction({
      amount,
      tokenType,
      creator,
      from,
      message: message ?? "",
      mediashare: mediashare ?? "",
      transactionHash,
    });

    // const user = await findByAddress(fromAddress);

    const payloadTopic = {
      //   donator: user?.username ? user.username + " 🍭" : from,
      donator: from + " 🍭",
      message: message ?? "",
      amount,
      symbol: tokenType,
    };

    if (mediashare) {
      const media = mediashare
        ? {
            type: "yt",
            url: mediashare,
            start: 0,
            end: 10,
          }
        : {};

      sendToTopic({
        exchangeName: creator,
        feature: "MEDIASHARE",
        message: JSON.stringify({
          ...payloadTopic,
          media,
        }),
      });
    } else {
      sendToTopic({
        exchangeName: creator,
        feature: "ALERT",
        message: JSON.stringify(payloadTopic),
      });
    }

    res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error: any) {
    res.status(error.message === "Missing required fields" ? 400 : 500).json({
      success: false,
      message: error.message || "Failed to create transaction",
    });
  }
});

export { router };
