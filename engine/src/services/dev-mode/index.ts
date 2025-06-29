import { sendToTopic } from "@/packages/rabbitmq";
import { Router } from "express";

const router = Router();

router.get("/mediashare/:address/:symbol", async (req, res) => {
  const address = req.params.address;
  const symbol = req.params.symbol;

  if (!address) {
    res.send({ error: "Address is required" });
  }

  const payload = {
    donator: "rei 🍭",
    message: "Notification test 🤙🤪",
    amount: 0.1,
    symbol: symbol ?? "ETH",
    media: {
      type: "yt",
      url: "https://youtu.be/JNFO40e10CA?si=NavP0YMqSXiIjuD8",
      start: 0,
      end: 10,
    },
  };

  sendToTopic({
    exchangeName: address,
    feature: "MEDIASHARE",
    message: JSON.stringify(payload),
  });

  res.send({ success: "🍭" });
});

router.get("/alerts/:address/:symbol", async (req, res) => {
  const address = req.params.address;
  const symbol = req.params.symbol;

  if (!address) {
    res.json({
      error: "Address is required",
    });
  }

  const payload = {
    donator: "rei 🍭",
    message: "Notification test 🤙🤪",
    amount: 100,
    symbol: symbol ?? "USDC",
  };

  sendToTopic({
    exchangeName: address,
    feature: "ALERT",
    message: JSON.stringify(payload),
  });

  res.send({ success: "🍬" });
});

export { router };
