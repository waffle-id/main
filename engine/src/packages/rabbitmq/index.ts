import CONFIG from "@/config";
import amq, { ConsumeMessage } from "amqplib";

let amqConnection!: amq.Connection;
let channels: Map<string, amq.Channel> = new Map();
const QUEUE_NAME = "overlays";

/* -------------------------------------------------------------------------- */
/*                                 connection                                 */
/* -------------------------------------------------------------------------- */
export async function connectAmq() {
  amqConnection = await amq.connect(CONFIG.RABBITMQ_URI);
  console.log("🐇 Connected to RabbitMQ");
  return amqConnection;
}

/* -------------------------------------------------------------------------- */
/*                               create channel                               */
/* -------------------------------------------------------------------------- */
export async function createChannel({ exchangeName }: { exchangeName: string }) {
  if (channels.has(exchangeName)) {
    return channels.get(exchangeName);
  }

  const channel = await amqConnection.createChannel();
  await channel.assertExchange(exchangeName, "topic", { durable: false, autoDelete: true });

  channels.set(exchangeName, channel);
  return channel;
}

/* -------------------------------------------------------------------------- */
/*                                send to topic                               */
/* -------------------------------------------------------------------------- */
export async function sendToTopic({
  exchangeName,
  feature,
  message,
}: {
  exchangeName: string;
  feature: string;
  message: string;
}): Promise<void> {
  try {
    const channel = await createChannel({ exchangeName });
    channel!.publish(exchangeName, feature, Buffer.from(message));
    console.log(`📤 Sent to "${exchangeName}" [${feature}]:`, message);
  } catch (error) {
    console.error("❌ Error sending message:", error);
  }
}

/* -------------------------------------------------------------------------- */
/*                             consume from topic                             */
/* -------------------------------------------------------------------------- */
export async function consumeFromTopic({
  exchangeName,
  feature,
  callback,
}: {
  exchangeName: string;
  feature: string;
  callback: (routingKey: string, message: ConsumeMessage) => void;
}): Promise<void> {
  try {
    const channel = await createChannel({ exchangeName });
    const q = await channel!.assertQueue(
      "",
      // { exclusive: true }
      {
        durable: false, // Non-durable queue
        arguments: {
          "x-expires": 1000 * 60 * 10, // Queue auto-deletion timeout in milliseconds
        },
      }
    );

    await channel!.bindQueue(q.queue, exchangeName, feature);

    console.log(`📥 Waiting for messages in "${exchangeName}" with pattern "${feature}"`);

    channel!.consume(
      q.queue,
      (msg: ConsumeMessage | null) => {
        if (msg) {
          //   callback(msg.fields.routingKey, msg.content.toString());
          //   channel.ack(msg);
          callback(msg.fields.routingKey, msg);
        }
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error("❌ Error consuming messages:", error);
  }
}

/* -------------------------------------------------------------------------- */
/*                                     ack                                    */
/* -------------------------------------------------------------------------- */
export async function ackMessage({
  exchangeName,
  msg,
}: // deliveryTag,
{
  exchangeName: string;
  msg: ConsumeMessage;
  // deliveryTag: number;
}) {
  const channel = await createChannel({ exchangeName });
  channel!.ack(msg);
}
