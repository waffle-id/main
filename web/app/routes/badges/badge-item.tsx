import { Award, Trophy, type LucideProps } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createPublicClient, http } from "viem";
import { monadTestnet, bscTestnet } from "viem/chains";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Badge } from "~/components/shadcn/badge";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";
import { ABI } from "~/constants/ABI";
import { CA } from "~/constants/CA";
import { cn } from "~/utils/cn";

export type BadgeItemProps = {
  title: string;
  desc: string;
  images: string;
  category: string;
  rarity: string;
  earned: number;
  badgeId: number;
};

const RARITY_STYLES: Record<string, string> = {
  Common: "from-gray-400 to-gray-600 border-gray-300",
  Uncommon: "from-green-400 to-green-600 border-green-300",
  Rare: "from-blue-400 to-blue-600 border-blue-300",
  Epic: "from-purple-400 to-purple-600 border-purple-300",
  Legendary: "from-orange-400 to-orange-600 border-orange-300",
  Mythic: "from-pink-400 via-purple-500 to-indigo-600 border-pink-300",
};

export function BadgeItem({
  title,
  desc,
  images,
  category,
  rarity = "Common",
  earned,
  badgeId,
}: BadgeItemProps) {
  const [loading, setLoading] = useState(true);
  const [elig, setElig] = useState(false);
  const { address } = useAccount();

  const { data: mintHash, writeContract: doMintBadge, isPending } = useWriteContract();
  const { status: statusReceipt, isLoading: isLoadingReceipt } = useWaitForTransactionReceipt({
    hash: mintHash,
  });

  function mintBadge() {
    doMintBadge({
      abi: ABI,
      address: CA,
      functionName: "claimBadge",
      args: [badgeId],
    });
  }

  useEffect(() => {
    if (statusReceipt === "success") {
      toast.success("Minting succeed!", { closeButton: true, duration: Infinity });
    }
  }, [statusReceipt]);

  useEffect(() => {
    if (address) {
      const client = createPublicClient({ chain: bscTestnet, transport: http() });
      async function getData() {
        const isEligible = await client
          .readContract({
            abi: ABI,
            address: CA,
            functionName: "_checkBadgeEligibility",
            args: [address, badgeId],
          })
          .catch(() => false);

        setLoading(false);
        setElig(Boolean(isEligible ?? false));
      }

      getData();
    }
  }, [address]);

  return (
    <div className="relative bg-gradient-to-br from-white to-orange-50/30 rounded-3xl p-8 shadow overflow-hidden">
      {/* Background Effects */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-orange-300/20 to-yellow-400/20 rounded-full" />

      <Badge
        className={cn(
          `absolute top-4 right-4 text-white bg-gradient-to-r border-0 px-3 py-1`,
          RARITY_STYLES[rarity]
        )}
      >
        {rarity}
      </Badge>

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Badge Image Container */}
        <div className="relative bg-white rounded-full p-6 shadow-inner">
          <img
            src={images}
            className="size-20 object-contain"
            alt={title}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
        </div>

        {/* Badge Info */}
        <div className="text-center space-y-3">
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{desc}</p>

          {/* Category and Stats */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge className="bg-orange-100 text-orange-700 border-orange-200">{category}</Badge>
            {earned && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Trophy className="size-4" />
                {earned.toLocaleString()} earned
              </div>
            )}
          </div>
        </div>

        {/* Earn Button */}
        {!isPending && !isLoadingReceipt && (
          <ButtonMagnet
            className="w-full"
            disabled={loading || !elig}
            onClick={(e) => (loading || !elig ? e.preventDefault() : mintBadge())}
          >
            <div className="flex flex-row items-center justify-center gap-2">
              {loading && "Loading ..."}
              {!loading && !elig && "Not Eligible"}
              {!loading && elig && (
                <>
                  <Award className="size-4" />
                  Claim Badge
                </>
              )}
            </div>
          </ButtonMagnet>
        )}

        {(isPending || isLoadingReceipt) && (
          <ButtonMagnet className="w-full">Loading Minting ...</ButtonMagnet>
        )}
      </div>
    </div>
  );
}
