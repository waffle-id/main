import type { Config } from "wagmi";
import { defaultConfig } from "@xellar/kit";
import { monadTestnet, liskSepolia } from "viem/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { injected, metaMask } from "wagmi/connectors";

export const FIXED_CHAIN = monadTestnet.id;

export const WAGMI_XELLAR_CONFIG = defaultConfig({
  appName: "Waffle",
  // walletConnectProjectId: "5a26ed9ab5fae12d12af7250d0611486",
  walletConnectProjectId: "702bd4efaeffd9a2a114b75acc3cc307",
  xellarAppId: "e766524a-ad0d-4268-b42c-9ec0eae5999d",
  xellarEnv: "sandbox",
  chains: [
    monadTestnet,
    // liskSepolia,
  ],
  ssr: true,
}) satisfies Config;

export const WAGMI_RAINBOW_CONFIG = getDefaultConfig({
  appName: "Waffle",
  projectId: "702bd4efaeffd9a2a114b75acc3cc307",
  chains: [monadTestnet],
  // connectors: [injected(), metaMask()],
  ssr: true,
});
