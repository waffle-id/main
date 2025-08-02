import type { Config } from "wagmi";
import { defaultConfig } from "@xellar/kit";
import { monadTestnet, liskSepolia } from "viem/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { injected, metaMask } from "wagmi/connectors";
import { getPublicClient } from "@wagmi/core";

export const FIXED_CHAIN = liskSepolia.id;

export const WAGMI_XELLAR_CONFIG = defaultConfig({
  appName: "Waffle",
  // walletConnectProjectId: "5a26ed9ab5fae12d12af7250d0611486",
  walletConnectProjectId: "43c07cbc-1bc4-4937-bab1-1443188626b6",
  xellarAppId: "e766524a-ad0d-4268-b42c-9ec0eae5999d",
  xellarEnv: "sandbox",
  chains: [liskSepolia],
  ssr: true,
}) satisfies Config;

// export const WAGMI_RAINBOW_CONFIG = getDefaultConfig({
//   appName: "Waffle",
//   projectId: "43c07cbc-1bc4-4937-bab1-1443188626b6",
//   chains: [],
//   // connectors: [injected(), metaMask()],
//   ssr: true,
// });

export const publicClient = getPublicClient(WAGMI_XELLAR_CONFIG);
