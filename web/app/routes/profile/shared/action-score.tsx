import { Share2, Wallet } from "lucide-react";
import type { JSX } from "react";
import { LogoAnimationNoRepeat } from "~/components/waffle/logo/logo-animation-no-repeat";
import { useParams } from "react-router";

interface ActionScoreProps {
  reputationScore?: number;
  hasInvitationAuthority?: boolean;
}

export function ActionScore({
  reputationScore = 1234,
  hasInvitationAuthority = false,
}: ActionScoreProps) {
  const params = useParams();

  const handleTwitterClick = () => {
    if (params.variant === "x" && params.slug) {
      window.open(`https://x.com/${params.slug}`, "_blank");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-row items-center justify-end gap-8">
        <IconX
          className={`size-6 ${
            params.variant === "x"
              ? "cursor-pointer hover:opacity-70 transition-opacity"
              : "cursor-default opacity-50"
          }`}
          onClick={params.variant === "x" ? handleTwitterClick : undefined}
        />
        <Wallet className="size-6 cursor-pointer" />
        <Share2 className="size-6 cursor-pointer" />
      </div>
      <div className="flex flex-row gap-8 items-center">
        <div className="flex flex-col items-end">
          <p className="font-alt text-5xl">{reputationScore}</p>
          <p className="text-sm text-gray-600">Reputation Score</p>
          {hasInvitationAuthority && (
            <p className="text-xs text-green-600 mt-1">Invitation Authority</p>
          )}
        </div>
        <LogoAnimationNoRepeat className="size-32" />
      </div>
    </div>
  );
}

export function IconX({ className, onClick }: JSX.IntrinsicElements["svg"]) {
  return (
    <svg role="img" viewBox="0 0 24 24" className={className} onClick={onClick}>
      <title>X</title>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}
