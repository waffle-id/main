import { Award, BadgeCheckIcon } from "lucide-react";
import { Badge } from "~/components/shadcn/badge";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";
import { TextStaticAnimation } from "~/components/waffle/logo/text-static-animation";
import { Separator } from "~/components/waffle/separator";

export default function LeaderboardPage() {
  return (
    <>
      <div className="mt-32 px-[20px] lg:px-[50px]">
        <div className="grid grid-cols-2 ">
          <div className="flex flex-col justify-between mt-24">
            <div className="flex flex-col gap-2">
              <p className="text-gray-dark">Most Credible</p>
              <p className="text-black text-5xl">Leaderboards</p>
            </div>
            <TextStaticAnimation className="w-max" />
          </div>
          <div className="grid grid-cols-3 text-black mt-24">
            {new Array(3).fill("").map((val, idx) => (
              <div key={idx} className="flex flex-col gap-2 h-full mx-2">
                <p className="font-alt text-2xl">-{idx + 1}</p>
                <img src="https://placehold.co/10" className="aspect-[9/16] object-cover" />
                <p className="text-lg">rei_yan__</p>
                <p className="text-sm font-semibold mt-4">read more</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator className="mt-24" />

      <div className="mt-32 px-[20px] lg:px-[50px]">
        <div className="my-24 flex flex-col gap-8">
          <p className="text-5xl text-black">Most Credible</p>
          <div className="grid grid-cols-6 w-full text-black text-md">
            <p className="text-black text-sm border-b border-gray-400 border-dashed py-3">Rank</p>
            <p className="text-black text-sm border-b border-gray-400 border-dashed py-3">Name</p>
            <p className="text-black text-sm border-b border-gray-400 border-dashed py-3">Score</p>
            <p className="text-black text-sm border-b border-gray-400 border-dashed py-3">Review</p>
            <p className="text-black text-sm border-b border-gray-400 border-dashed py-3">
              Vouched for
            </p>
            <p className="text-black text-sm border-b-2 border-gray-300 border-dashed py-3 text-center">
              Badges
            </p>
            {new Array(20).fill("").map((val, idx) => (
              <>
                <div className="border-b border-gray-400 border-dashed py-3">
                  <div className="grid grid-cols-2 w-max items-center">
                    {[0, 1, 2].includes(idx) ? (
                      <Award className="size-5" />
                    ) : (
                      <span className="size-5">&nbsp;</span>
                    )}
                    <p className="ml-1">{idx + 1}</p>
                  </div>
                </div>
                <div className="border-b border-gray-400 border-dashed py-3">Lorem</div>
                <div className="border-b border-gray-400 border-dashed py-3">1900</div>
                <div className="border-b border-gray-400 border-dashed py-3">123</div>
                <div className="border-b border-gray-400 border-dashed py-3">$2000</div>
                <div className="border-b border-gray-400 border-dashed py-3">
                  <div className="flex flex-row gap-1 items-center justify-center">
                    <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
                      <BadgeCheckIcon />
                      Verified
                    </Badge>
                    {idx % 2 == 0 && (
                      <Badge className="bg-foreground text-white dark:bg-blue-600">
                        <BadgeCheckIcon />
                        Verified
                      </Badge>
                    )}
                    {idx % 3 == 0 && (
                      <Badge className="bg-white text-black dark:bg-blue-600">
                        <BadgeCheckIcon />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </>
            ))}
          </div>
          <ButtonMagnet className="w-max self-center mt-12" size="lg">
            Load More
          </ButtonMagnet>
        </div>
      </div>
    </>
  );
}
