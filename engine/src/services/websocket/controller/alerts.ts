import { consumeFromTopic, createChannel } from "@/packages/rabbitmq";
import { Request } from "express";
import { WebSocket } from "ws";

export function alertsHandler(ws: WebSocket, req: Request) {
  const address = req.query.address as string;

  if (!address) {
    return ws.send(JSON.stringify({ error: "Address is required" }));
  }

  createChannel({ exchangeName: address });

  consumeFromTopic({
    exchangeName: address,
    feature: "ALERT",
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
      ws.send("pong");
      return;
    }
  });
}
