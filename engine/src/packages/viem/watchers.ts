import {
  createPublicClient,
  webSocket,
  parseAbi,
  parseAbiItem,
  decodeEventLog,
  fromHex,
  hexToString,
  decodeAbiParameters,
  parseAbiParameters,
} from "viem";
import { optimismSepolia } from "viem/chains";

// Setup WebSocket client

// https://optimism-mainnet.infura.io/v3/ff13c1b25d9f4e939b5143372e0f5f41

const abi = parseAbi([
  "event Increment(uint indexed finalNum)",
  "event Decrement(uint indexed finalNum)",
  "event Test3Indexed(uint indexed finalNum, string indexed halo, string indexed hai)",
  "event TestNo3Indexed(uint indexed finalNum, string indexed halo, string indexed hai)",
  "function getCount() view returns (uint)",
  "function count() view returns (uint)",
  //
]);

export async function startWatcherEvents() {
  const client = createPublicClient({
    chain: optimismSepolia,
    transport: webSocket("wss://optimism-sepolia.infura.io/ws/v3/ff13c1b25d9f4e939b5143372e0f5f41"),
  });

  const fromBlockNumber = (await client.getBlockNumber()) - 20n;

  console.log("start watcher events");

  // const decodeTopicIndexed = decodeEventLog({
  //   abi: abi,
  //   topics: [
  //     "0x50fb939af7689fd540ad9ef1a4080f66a503097b7ab27ead7c7d3eda4bdb7ecf",
  //     "0x0000000000000000000000000000000000000000000000000000000000000001",
  //     "0xe07a44dde9fea32737a5cf3f9683b3235138654aa2d189f6fe44af37a61dc60d",
  //     "0x273f375e4d691f945094023964e86c9d04d4d6e6a1edd2bcc13e19ee9a396ae9",
  //   ],
  // });

  // console.log("decodeTopic", decodeTopicIndexed);

  //   🔔 Transfer detected: 0x8a5945bb2aa8cf0b91bac72c29811c5bae0e637d → 0xc4dfc476084738b0511332c9e4be748f924f03209d01246466d343a7bc616d4c | Topics:
  //  0x51af157c2eee40f68107a47a49c32fbbeb0a3c9e5cd37aa56e88e6be92368a81,0x0000000000000000000000000000000000000000000000000000000000000001

  // 🔔 Transfer detected: 0x8a5945bb2aa8cf0b91bac72c29811c5bae0e637d → 0xc4dfc476084738b0511332c9e4be748f924f03209d01246466d343a7bc616d4c | Topics:
  //  0x50fb939af7689fd540ad9ef1a4080f66a503097b7ab27ead7c7d3eda4bdb7ecf,0x0000000000000000000000000000000000000000000000000000000000000001,0xe07a44dde9fea32737a5cf3f9683b3235138654aa2d189f6fe44af37a61dc60d,0x273f375e4d691f945094023964e86c9d04d4d6e6a1edd2bcc13e19ee9a396ae9

  // 🔔 Transfer detected: 0x8a5945bb2aa8cf0b91bac72c29811c5bae0e637d → 0xc4dfc476084738b0511332c9e4be748f924f03209d01246466d343a7bc616d4c | Topics:
  //  0x7b464ea3c4c628548ee232a031b163267af1aed0e082e5c492d4a078a0cd8135

  const decodeTopicAbi = decodeAbiParameters(
    // [
    //   { type: "uint", name: "finalNum", indexed: true },
    // { type: "string", name: "halo", indexed: true },
    //   { type: "string", name: "hai", indexed: true },
    // ],
    parseAbiParameters("uint finalNum, string halo, string hai"),
    "0x0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000009696e6372656d656e74000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000037265690000000000000000000000000000000000000000000000000000000000"
  );

  console.log("decodeLogNoIndexed", decodeTopicAbi);

  // client.watchEvent({
  //   address: "0x8A5945bB2aa8cf0b91BAc72c29811C5bAE0e637D",
  //   events: abi,
  //   fromBlock: fromBlockNumber,
  //   onLogs: (logs) => {
  //     logs.forEach((log) => {
  //       console.log(
  //         `🔔 Transfer detected: ${log.address} → ${log.transactionHash} | Topics: \n ${log.topics}`
  //       );
  //       console.log("mentahan", log);
  //     });
  //   },
  //   onError(error) {
  //     console.error("❌ Error watching event:", error);
  //   },
  // });

  /* ---------------------------- Wallet view only ---------------------------- */
  const data = await client.readContract({
    address: "0x8A5945bB2aa8cf0b91BAc72c29811C5bAE0e637D",
    abi: abi,
    functionName: "count",
  });

  console.log("data", data);
}
