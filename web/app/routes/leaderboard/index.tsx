import { Award, BadgeCheckIcon } from "lucide-react";
import React from "react";
import { useLoaderData, useLocation } from "react-router";
import { Badge } from "~/components/shadcn/badge";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";
import { TextStaticAnimation } from "~/components/waffle/logo/text-static-animation";
import { Separator } from "~/components/waffle/separator";
import type { Route } from "./+types";
import { capitalizeEachWord } from "~/utils/formatter";
import { getLeaderboardSEO } from "~/utils/seo";

export function meta({ params }: Route.MetaArgs): Route.MetaDescriptors {
  const category = params.categories || "most-credible";
  return getLeaderboardSEO(category);
}
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/shadcn/tooltip";
import { useState } from "react";
import { useEffect } from "react";
import { BASE_URL } from "~/constants/constant";
import type { UserLeaderboard } from "~/types/account-service";
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();
  const [top3, setTop3] = useState<UserLeaderboard[]>([]);
  const [users, setUsers] = useState<UserLeaderboard[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // const loaderData = useLoaderData();
  // const { title } = loaderData;

  const fetchLeaderboard = async (page = 1) => {
    setLoading(true);
    const res = await fetch(`${BASE_URL}/account/?page=${page}&size=20&sortBy=reputationScore`);
    const data = await res.json();

    if (page === 1) {
      setTop3(data.users.slice(0, 3));
      setUsers(data.users);
    } else {
      setUsers((prev) => [...prev, ...data.users]);
    }

    if (data.pagination.page < data.pagination.totalPages) {
      setHasMore(true);
      setPage((prev) => prev + 1); // increase local state
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard(1); // fetch on mount
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchLeaderboard((page as number) + 1);
    }
  };

  return (
    <>
      <div className="mt-16 sm:mt-20 md:mt-24 lg:mt-32 px-4 sm:px-6 md:px-8 lg:px-[50px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="flex flex-col justify-between mt-12 sm:mt-16 md:mt-20 lg:mt-24 order-1 lg:order-1">
            <div className="flex flex-col gap-2 text-center lg:text-left">
              <p className="text-gray-dark text-sm sm:text-base">Most Credible</p>
              <p className="text-black text-3xl sm:text-4xl md:text-5xl">Leaderboards</p>
            </div>
            <div className="mt-8 lg:mt-0 flex justify-center lg:justify-start">
              <TextStaticAnimation className="w-max" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 text-black mt-12 sm:mt-16 md:mt-20 lg:mt-24 order-2 lg:order-2">
            {top3.map((user, idx) => (
              <div key={idx} className="flex flex-col gap-4 sm:gap-6 h-full relative">
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
                    className={`group flex items-center justify-center size-12 sm:size-14 md:size-16 rounded-full text-white font-bold text-lg sm:text-xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-500 ${idx === 0
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

                <div className="group relative bg-gradient-to-br from-white/90 to-orange-50/60 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border-2 border-orange-200/50 shadow-xl hover:shadow-2xl hover:border-orange-300/70 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-100/10 to-yellow-100/10 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {idx === 0 && (
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-orange-400/5 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  )}

                  <div className="flex flex-col items-center gap-4 sm:gap-6 relative z-10">
                    <div className="relative size-24 sm:size-28 md:size-32 lg:size-36 group/avatar">
                      <div
                        className={`absolute inset-0 rounded-full shadow-lg transition-all duration-500 group-hover/avatar:scale-105 ${idx === 0
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
                        src={
                          user.avatarUrl ||
                          `https://api.dicebear.com/9.x/big-smile/svg?seed=leaderboard${idx + 1}`
                        }
                        className="relative z-10 size-24 sm:size-28 md:size-32 lg:size-36 rounded-full p-3 sm:p-4 transition-transform duration-500 group-hover/avatar:scale-110"
                        alt={`Top ${idx + 1} user`}
                      />

                      {idx === 0 && (
                        <div
                          className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xl sm:text-2xl animate-bounce"
                          style={{ animationDuration: "2s" }}
                        >
                          👑
                        </div>
                      )}
                    </div>

                    <div className="text-center">
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
                        {user.username || `user_${String(idx + 1).padStart(3, "0")}`}
                      </p>
                      <div className="flex items-center justify-center gap-2 sm:gap-3 mt-3 bg-white/50 rounded-full px-3 sm:px-4 py-2 backdrop-blur-sm border border-orange-200/50">
                        <Award
                          className={`size-4 sm:size-5 transition-all duration-300 ${idx === 0
                              ? "text-yellow-500 drop-shadow-sm"
                              : idx === 1
                                ? "text-gray-400"
                                : "text-amber-600"
                            }`}
                        />
                        <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700">
                          {user.reputationScore} pts
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        navigate(
                          user.username
                            ? `/profile/x/${user.username}`
                            : `/profile/w/${user.address}`
                        );
                      }}
                      className="group/btn cursor-pointer text-xs sm:text-sm font-semibold bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 border border-orange-300/50"
                    >
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

      <Separator className="mt-12 sm:mt-16 md:mt-20 lg:mt-24" />

      <div className="mt-16 sm:mt-20 md:mt-24 lg:mt-32 px-4 sm:px-6 md:px-8 lg:px-[50px]">
        <div className="my-12 sm:my-16 md:my-20 lg:my-24 flex flex-col gap-6 sm:gap-8">
          <p className="text-3xl sm:text-4xl md:text-5xl text-black text-center lg:text-left">Most Credible</p>


          <div className="hidden lg:block">
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
              {users.map((user, idx) => (
                <React.Fragment key={idx}>
                  <div className="border-b border-gray-400 border-dashed py-3">
                    <div className="flex flex-row w-max items-center gap-4">
                      {[0, 1, 2].includes(idx) ? (
                        <Award
                          className={`size-5 transition-all duration-300 ${idx === 0
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
                        className={`ml-1 font-medium ${[0, 1, 2].includes(idx) ? "text-orange-600" : ""
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
                          src={
                            user.avatarUrl ??
                            `https://api.dicebear.com/9.x/big-smile/svg?seed=rank${idx + 1}`
                          }
                          className="relative z-10 size-10 aspect-square rounded-full p-1.5 group-hover:scale-110 transition-transform duration-300"
                          alt=""
                        />
                      </div>
                      <p
                        onClick={() => {
                          navigate(
                            user.username
                              ? `/profile/x/${user.username}`
                              : `/profile/w/${user.address}`
                          );
                        }}
                        className="font-medium hover:text-orange-600 transition-colors duration-300 cursor-pointer"
                      >
                        {user.username ?? user.address ?? `User${String(idx + 1).padStart(3, "0")}`}
                      </p>
                    </div>
                  </div>
                  <div className="border-b border-gray-400 border-dashed py-3">
                    <div className="flex items-center h-full">
                      <p>{user.reputationScore}</p>
                    </div>
                  </div>
                  <div className="border-b border-gray-400 border-dashed py-3">
                    <div className="flex items-center h-full">
                      <p>{user.receivedReviewCount ?? 0}</p>
                    </div>
                  </div>
                  <div className="border-b border-gray-400 border-dashed py-3">
                    <div className="flex items-center h-full">
                      <p>-</p>
                    </div>
                  </div>
                  <div className="border-b border-gray-400 border-dashed py-3">
                    <div className="flex flex-row gap-2 items-center justify-center">
                      -
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>


          <div className="lg:hidden space-y-4">
            {users.map((user, idx) => (
              <div
                key={idx}
                className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {[0, 1, 2].includes(idx) ? (
                        <Award
                          className={`size-5 transition-all duration-300 ${idx === 0
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
                        className={`text-lg font-bold ${[0, 1, 2].includes(idx) ? "text-orange-600" : "text-gray-700"
                          }`}
                      >
                        #{idx + 1}
                      </p>
                    </div>
                    <div className="bg-white/50 rounded-full px-3 py-1 backdrop-blur-sm border border-orange-200/50">
                      <p className="text-sm font-semibold text-gray-700">
                        {user.reputationScore} pts
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="relative size-12 sm:size-14 flex-shrink-0 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-500 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300"></div>
                    <img
                      src={
                        user.avatarUrl ??
                        `https://api.dicebear.com/9.x/big-smile/svg?seed=rank${idx + 1}`
                      }
                      className="relative z-10 size-12 sm:size-14 aspect-square rounded-full p-2 group-hover:scale-110 transition-transform duration-300"
                      alt=""
                    />
                  </div>
                  <div className="flex-1">
                    <p
                      onClick={() => {
                        navigate(
                          user.username
                            ? `/profile/x/${user.username}`
                            : `/profile/w/${user.address}`
                        );
                      }}
                      className="font-semibold text-lg hover:text-orange-600 transition-colors duration-300 cursor-pointer truncate"
                    >
                      {user.username ?? user.address ?? `User${String(idx + 1).padStart(3, "0")}`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-800">Reviews</p>
                    <p>{user.receivedReviewCount ?? 0}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Vouched for</p>
                    <p>-</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <ButtonMagnet
              className="w-max self-center mt-8 sm:mt-12"
              size="lg"
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More"}
            </ButtonMagnet>
          )}
        </div>
      </div>
    </>
  );
}
