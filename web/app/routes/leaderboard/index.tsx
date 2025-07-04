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
        <div className="grid grid-cols-2 ">
          <div className="flex flex-col justify-between mt-24">
            <div className="flex flex-col gap-2">
              <p className="text-gray-dark">{title}</p>
              <p className="text-black text-5xl">Leaderboards</p>
            </div>
            <TextStaticAnimation className="w-max" />
          </div>
          <div className="grid grid-cols-3 gap-8 text-black mt-24">
            {new Array(3).fill("").map((val, idx) => (
              <div key={idx} className="flex flex-col gap-6 h-full relative">
                <div
                  className="absolute -top-2 -right-2 w-3 h-3 bg-orange-300/20 rounded-full animate-pulse"
                  style={{ animationDelay: `${idx * 0.5}s` }}
                ></div>
                <div
                  className="absolute -bottom-4 -left-2 w-2 h-2 bg-yellow-400/30 rounded-full animate-bounce"
                  style={{ animationDelay: `${idx * 0.7}s` }}
                ></div>

                <div className="flex justify-center">
                  <div
                    className={`group flex items-center justify-center size-16 rounded-full text-white font-bold text-xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-500 ${
                      idx === 0
                        ? "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-300 hover:to-yellow-700"
                        : idx === 1
                        ? "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 hover:from-gray-200 hover:to-gray-600"
                        : "bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-900"
                    } relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                    <span className="relative z-10">{idx + 1}</span>
                    {idx === 0 && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse rounded-full"></div>
                    )}
                  </div>
                </div>

                <div className="group relative bg-gradient-to-br from-white/90 to-orange-50/60 backdrop-blur-md rounded-3xl p-8 border-2 border-orange-200/50 shadow-xl hover:shadow-2xl hover:border-orange-300/70 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-100/10 to-yellow-100/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {idx === 0 && (
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-orange-400/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  )}

                  <div className="flex flex-col items-center gap-6 relative z-10">
                    <div className="relative size-36 group/avatar">
                      <div
                        className={`absolute inset-0 rounded-full shadow-lg transition-all duration-500 group-hover/avatar:scale-105 ${
                          idx === 0
                            ? "bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500"
                            : idx === 1
                            ? "bg-gradient-to-br from-gray-300 via-blue-300 to-purple-400"
                            : "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500"
                        }`}
                      ></div>

                      {idx === 0 && (
                        <div
                          className="absolute -inset-2 border-4 border-yellow-400/30 rounded-full animate-spin"
                          style={{ animationDuration: "8s" }}
                        ></div>
                      )}

                      <img
                        src={`https://api.dicebear.com/9.x/big-smile/svg?seed=leaderboard${
                          idx + 1
                        }`}
                        className="relative z-10 size-36 rounded-full p-4 transition-transform duration-500 group-hover/avatar:scale-110"
                        alt={`Top ${idx + 1} user`}
                      />

                      {idx === 0 && (
                        <div
                          className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-2xl animate-bounce"
                          style={{ animationDuration: "2s" }}
                        >
                          👑
                        </div>
                      )}
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800 mb-2">
                        user_{String(idx + 1).padStart(3, "0")}
                      </p>
                      <div className="flex items-center justify-center gap-3 mt-3 bg-white/50 rounded-full px-4 py-2 backdrop-blur-sm border border-orange-200/50">
                        <Award
                          className={`size-5 transition-all duration-300 ${
                            idx === 0
                              ? "text-yellow-500 drop-shadow-sm"
                              : idx === 1
                              ? "text-gray-400"
                              : "text-amber-600"
                          }`}
                        />
                        <p className="text-lg font-semibold text-gray-700">
                          {2000 - idx * 100} pts
                        </p>
                      </div>
                    </div>

                    <button className="group/btn cursor-pointer text-sm font-semibold bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 border border-orange-300/50">
                      <span className="flex items-center gap-2">
                        View Profile
                        <span className="text-xs group-hover/btn:translate-x-1 transition-transform duration-300">
                          →
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
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
                      <Award
                        className={`size-5 transition-all duration-300 ${
                          idx === 0
                            ? "text-yellow-500 drop-shadow-sm animate-pulse"
                            : idx === 1
                            ? "text-gray-400"
                            : "text-amber-600"
                        }`}
                      />
                    ) : (
                      <span className="size-5">&nbsp;</span>
                    )}
                    <p
                      className={`ml-1 font-medium ${
                        [0, 1, 2].includes(idx) ? "text-orange-600" : ""
                      }`}
                    >
                      {idx + 1}
                    </p>
                  </div>
                </div>
                <div className="border-b border-gray-400 border-dashed py-3">
                  <div className="flex flex-row gap-4 items-center">
                    <div className="relative size-10 flex-shrink-0 group">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-500 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300"></div>
                      <img
                        src={`https://api.dicebear.com/9.x/big-smile/svg?seed=rank${idx + 1}`}
                        className="relative z-10 size-10 aspect-square rounded-full p-1.5 group-hover:scale-110 transition-transform duration-300"
                        alt=""
                      />
                    </div>
                    <p className="font-medium hover:text-orange-600 transition-colors duration-300 cursor-pointer">
                      User{String(idx + 1).padStart(3, "0")}
                    </p>
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
                  <div className="flex flex-row gap-2 items-center justify-center">
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge className="bg-gradient-to-br from-white to-orange-50 text-black border border-orange-200/50 hover:border-orange-300 hover:shadow-md transition-all duration-300 hover:scale-105">
                          <img
                            src="https://ik.imagekit.io/3592mo0vh/waffle/contrib.svg"
                            className="size-10 hover:rotate-12 transition-transform duration-300"
                          />
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Contributor 🎯</p>
                      </TooltipContent>
                    </Tooltip>
                    {idx % 2 == 0 && (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge className="bg-gradient-to-br from-white to-orange-50 text-black border border-orange-200/50 hover:border-orange-300 hover:shadow-md transition-all duration-300 hover:scale-105">
                            <img
                              src="https://ik.imagekit.io/3592mo0vh/waffle/support.svg"
                              className="size-10 hover:rotate-12 transition-transform duration-300"
                            />
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Supportive 🤝</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {idx % 3 == 0 && (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge className="bg-gradient-to-br from-white to-orange-50 text-black border border-orange-200/50 hover:border-orange-300 hover:shadow-md transition-all duration-300 hover:scale-105">
                            <img
                              src="https://ik.imagekit.io/3592mo0vh/waffle/build.svg"
                              className="size-10 hover:rotate-12 transition-transform duration-300"
                            />
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Builder 🔨</p>
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
