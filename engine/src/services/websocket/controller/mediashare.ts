import { consumeFromTopic, createChannel } from "@/packages/rabbitmq";
import { findByAddress } from "@/services/account/controller/find";
import { Request } from "express";
import { WebSocket } from "ws";

export function mediashareHandler(ws: WebSocket, req: Request) {
  const address = req.query.address as string;

  if (!address) {
    return ws.send(JSON.stringify({ error: "Address is required" }));
  }

  createChannel({ exchangeName: address });

  consumeFromTopic({
    exchangeName: address,
    feature: "MEDIASHARE",
    callback: (routingKey, message) => {
      ws.send(
        JSON.stringify({
          payload: {
            ...JSON.parse(message.content.toString()),
          },
        })
      );
    },
  });

  ws.on("message", (msg) => {
    if (msg.toString() === "ping") {
      ws.send(`pong ${process.env.NODE_IP}: ${process.env.PORT}`);
      return;
    }
  });
}
