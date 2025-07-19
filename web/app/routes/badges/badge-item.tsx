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
  const [alreadyOwned, setAlreadyOwned] = useState(false);
  const { address } = useAccount();

  const { data: mintHash, writeContract: doMintBadge, isPending } = useWriteContract();
  const { status: statusReceipt, isLoading: isLoadingReceipt } = useWaitForTransactionReceipt({
    hash: mintHash,
  });

  function mintBadge() {
    if (alreadyOwned) {
      toast.error("You already own this badge!");
      return;
    }

    if (!elig) {
      toast.error("You are not eligible for this badge!");
      return;
    }

    doMintBadge({
      abi: ABI,
      address: CA,
      functionName: "claimBadge",
      args: [badgeId],
    });
  }

  const checkEligibilityAndOwnership = async () => {
    if (!address) return;

    setLoading(true);
    const client = createPublicClient({ chain: bscTestnet, transport: http() });

    try {
      const ownsTheBadge = await client
        .readContract({
          abi: ABI,
          address: CA,
          functionName: "hasBadge",
          args: [address, badgeId],
        })
        .catch((error) => {
          console.error("Error checking badge ownership:", error);
          return false;
        });

      const alreadyHasBadge = Boolean(ownsTheBadge);
      console.log(`Badge ${badgeId} ownership check for ${address}:`, alreadyHasBadge);
      setAlreadyOwned(alreadyHasBadge);

      if (!alreadyHasBadge) {
        try {
          const userProfile = await client
            .readContract({
              abi: ABI,
              address: CA,
              functionName: "userProfiles",
              args: [address],
            })
            .catch(() => null);

          const badgeInfo = await client
            .readContract({
              abi: ABI,
              address: CA,
              functionName: "getBadge",
              args: [badgeId],
            })
            .catch(() => null);

          if (userProfile && badgeInfo) {
            const userScore = (userProfile as any).reputationScore || 0;
            const requiredScore = (badgeInfo as any).requiredScore || 0;
            const isActive = (badgeInfo as any).isActive || false;

            const meetsRequirements =
              Number(userScore) >= Number(requiredScore) && Boolean(isActive);
            console.log(`Badge ${badgeId} eligibility:`, {
              userScore: Number(userScore),
              requiredScore: Number(requiredScore),
              isActive: Boolean(isActive),
              meetsRequirements,
            });
            setElig(meetsRequirements);
          } else {
            setElig(false);
          }
        } catch (eligibilityError) {
          console.error("Error checking eligibility:", eligibilityError);
          setElig(false);
        }
      } else {
        setElig(false);
      }
    } catch (error) {
      console.error("Error checking badge status:", error);
      setElig(false);
      setAlreadyOwned(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (statusReceipt === "success") {
      toast.success("Badge claimed successfully!", { closeButton: true, duration: 5000 });

      setAlreadyOwned(true);
      setElig(false);

      setTimeout(() => {
        checkEligibilityAndOwnership();
      }, 2000);
    }
  }, [statusReceipt]);

  useEffect(() => {
    if (address) {
      setAlreadyOwned(false);
      setElig(false);
      checkEligibilityAndOwnership();
    } else {
      setAlreadyOwned(false);
      setElig(false);
      setLoading(false);
    }
  }, [address, badgeId]);

  return (
    <div
      className={cn(
        "relative bg-gradient-to-br from-white to-orange-50/30 rounded-3xl p-8 shadow overflow-hidden h-full flex flex-col",
        alreadyOwned && "ring-2 ring-green-300 bg-gradient-to-br from-green-50 to-green-100/30"
      )}
    >
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-orange-300/20 to-yellow-400/20 rounded-full" />

      {alreadyOwned && (
        <Badge className="absolute top-4 left-4 bg-green-600 text-white border-0 px-3 py-1">
          ✓ Owned
        </Badge>
      )}

      <Badge
        className={cn(
          `absolute top-4 right-4 text-white bg-gradient-to-r border-0 px-3 py-1`,
          RARITY_STYLES[rarity]
        )}
      >
        {rarity}
      </Badge>

      <div className="relative z-10 flex flex-col items-center gap-6 flex-1 justify-between">
        <div className="flex flex-col items-center gap-6">
          <div
            className={cn(
              "relative bg-white rounded-full p-6 shadow-inner",
              alreadyOwned && "bg-green-50 ring-2 ring-green-200"
            )}
          >
            <img
              src={images}
              className={cn("size-20 object-contain", alreadyOwned && "opacity-80")}
              alt={title}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling?.classList.remove("hidden");
              }}
            />
            {alreadyOwned && (
              <div className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full p-1">
                <Award className="size-3" />
              </div>
            )}
          </div>

          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{desc}</p>

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
        </div>

        <div className="w-full mt-auto">
          {!isPending && !isLoadingReceipt && (
            <ButtonMagnet
              className="w-full"
              disabled={loading || !elig || alreadyOwned || !address}
              onClick={(e) => {
                if (loading || !elig || alreadyOwned || !address) {
                  e.preventDefault();
                  return;
                }
                mintBadge();
              }}
            >
              <div className="flex flex-row items-center justify-center gap-2">
                {loading && "Loading ..."}
                {!loading && !address && "Connect Wallet"}
                {!loading && address && alreadyOwned && "Already Owned"}
                {!loading && address && !alreadyOwned && !elig && "Not Eligible"}
                {!loading && address && !alreadyOwned && elig && (
                  <>
                    <Award className="size-4" />
                    Claim Badge
                  </>
                )}
              </div>
            </ButtonMagnet>
          )}

          {(isPending || isLoadingReceipt) && (
            <ButtonMagnet className="w-full">Minting...</ButtonMagnet>
          )}
        </div>
      </div>
    </div>
  );
}
