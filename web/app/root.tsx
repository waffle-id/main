import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect } from "react";
import Lenis from "lenis";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WAGMI_XELLAR_CONFIG } from "./constants/wagmi";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

import "./assets/styles/index.css";
import "@rainbow-me/rainbowkit/styles.css";
import { XellarKitProvider } from "@xellar/kit";
import { WaffleProvider } from "./components/waffle/waffle-provider";
import { Toaster } from "sonner";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Poppins:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Montserrat+Alternates:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
  },
  {
    rel: "icon",
    type: "image/x-icon",
    href: "/favicon.ico",
  },
  {
    rel: "icon",
    href: "/favicon.ico",
  },
];

if (typeof document !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export function Layout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Waffle",
    description:
      "Decentralized reputation and review platform building trust in the Web3 ecosystem",
    url: "https://waffle.food",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    sameAs: ["https://x.com/waffleidn", "https://github.com/waffle-id"],
    author: {
      "@type": "Organization",
      name: "Waffle",
      url: "https://waffle.food",
    },
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-sans">
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const queryClient = new QueryClient();

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      autoRaf: true,
    });

    const raf = () => {
      // lenis.raf();
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
  }, []);

  return (
    /* ------------------------------- RAINBOW KIT ------------------------------ */
    // <WagmiProvider config={WAGMI_RAINBOW_CONFIG}>
    //   <QueryClientProvider client={queryClient}>
    //     <RainbowKitProvider>
    //       <WaffleProvider>
    //         <Outlet />
    //       </WaffleProvider>
    //     </RainbowKitProvider>
    //   </QueryClientProvider>
    // </WagmiProvider>

    /* ------------------------------- XELLAR KIT ------------------------------- */
    <WagmiProvider config={WAGMI_XELLAR_CONFIG}>
      <QueryClientProvider client={queryClient}>
        <XellarKitProvider>
          <WaffleProvider>
            <Outlet />
          </WaffleProvider>
        </XellarKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
