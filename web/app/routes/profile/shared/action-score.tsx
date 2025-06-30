import { Share2, Wallet } from "lucide-react";
import type { JSX } from "react";
import { LogoAnimationNoRepeat } from "~/components/waffle/logo/logo-animation-no-repeat";

export function ActionScore() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-row items-center justify-end gap-8">
        <IconX className="size-6" />
        <Wallet className="size-6" />
        <Share2 className="size-6" />
      </div>
      <div className="flex flex-row gap-8 items-center">
        <p className="font-alt text-5xl">1234</p>
        <LogoAnimationNoRepeat className="size-32" />
      </div>
    </div>
  );
}

function IconX({ className }: JSX.IntrinsicElements["svg"]) {
  return (
    <svg role="img" viewBox="0 0 24 24" className={className}>
      <title>X</title>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}
