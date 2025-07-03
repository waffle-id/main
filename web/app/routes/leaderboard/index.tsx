import { Award, BadgeCheckIcon } from "lucide-react";
import React from "react";
import { useLoaderData, useLocation } from "react-router";
import { Badge } from "~/components/shadcn/badge";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";
import { TextStaticAnimation } from "~/components/waffle/logo/text-static-animation";
import { Separator } from "~/components/waffle/separator";
import type { Route } from "./+types";
import { capitalizeEachWord } from "~/utils/formatter";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/shadcn/tooltip";

export async function loader({ params, request, context }: Route.LoaderArgs) {
  let title = "most-credible"; // default

  if (params && params.categories) {
    title = params.categories;
  }

  return {
    title: capitalizeEachWord(title.split("-").join(" ")),
  };
}

export default function LeaderboardPage() {
  const loaderData = useLoaderData();
  const { title } = loaderData;

  return (
    <>
      <div className="mt-32 px-[20px] lg:px-[50px]">
        {/* <p>{JSON.stringify(loc)}</p> */}
        <div className="grid grid-cols-2 ">
          <div className="flex flex-col justify-between mt-24">
            <div className="flex flex-col gap-2">
              <p className="text-gray-dark">{title}</p>
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
              <React.Fragment key={idx}>
                <div className="border-b border-gray-400 border-dashed py-3">
                  <div className="flex flex-row w-max items-center gap-4">
                    {[0, 1, 2].includes(idx) ? (
                      <Award className="size-5" />
                    ) : (
                      <span className="size-5">&nbsp;</span>
                    )}
                    <p className="ml-1">{idx + 1}</p>
                  </div>
                </div>
                <div className="border-b border-gray-400 border-dashed py-3">
                  <div className="flex items-center h-full">
                    <p>Lorem</p>
                  </div>
                </div>
                <div className="border-b border-gray-400 border-dashed py-3">
                  <div className="flex items-center h-full">
                    <p>1900</p>
                  </div>
                </div>
                <div className="border-b border-gray-400 border-dashed py-3">
                  <div className="flex items-center h-full">
                    <p>123</p>
                  </div>
                </div>
                <div className="border-b border-gray-400 border-dashed py-3">
                  <div className="flex items-center h-full">
                    <p>$2000</p>
                  </div>
                </div>
                <div className="border-b border-gray-400 border-dashed py-3">
                  <div className="flex flex-row gap-1 items-center justify-center">
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge className="bg-white text-black">
                          <img
                            src="https://ik.imagekit.io/3592mo0vh/waffle/contrib.svg"
                            className="size-10"
                          />
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Contributor</p>
                      </TooltipContent>
                    </Tooltip>
                    {idx % 2 == 0 && (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge className="bg-white text-black">
                            <img
                              src="https://ik.imagekit.io/3592mo0vh/waffle/support.svg"
                              className="size-10"
                            />
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Supportive</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {idx % 3 == 0 && (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge className="bg-white text-black">
                            <img
                              src="https://ik.imagekit.io/3592mo0vh/waffle/build.svg"
                              className="size-10"
                            />
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Builder</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </React.Fragment>
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
