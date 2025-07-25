import axios from "axios";
import { NavLink, useLoaderData } from "react-router";
import type { Route } from "./+types";
import { generateSEO, SEO_CONFIGS } from "~/utils/seo";
import { fetchUsers, categorizeUsersByReputation, type User } from "~/services/users";

export function meta(): Route.MetaDescriptors {
  return generateSEO(SEO_CONFIGS.categories);
}

import {
  TrendingUp,
  Users,
  ArrowRight,
  Target,
  Award,
  Code,
} from "lucide-react";

export async function loader() {
  try {
    const [categoriesResponse, usersResponse] = await Promise.all([
      axios.get("https://api.waffle.food/categories").then<Record<string, string>[]>((resp) => resp.data.data),
      fetchUsers({ size: 100 })
    ]);

    const userStats = categorizeUsersByReputation(usersResponse.users);

    return {
      categories: categoriesResponse,
      users: usersResponse.users,
      userStats,
      totalUsers: usersResponse.pagination.total,
    };
  } catch (error) {
    return {
      categories: [],
      users: [],
      userStats: { credible: [], leastCredible: [], total: 0 },
      totalUsers: 0,
    };
  }
}

export default function CategoriesPage() {
  const loaderData = useLoaderData<typeof loader>();
  const { categories: apiCategories, userStats, totalUsers } = loaderData;

  const categoryEnhancements: Record<string, any> = {
    "Most Credible": {
      icon: Code,
      trending: true,
      iconBg: "linear-gradient(135deg, #f59e0b, #ea580c)",
    },
    "Least Credible": {
      icon: Users,
      trending: false,
      iconBg: "linear-gradient(135deg, #fb923c, #f59e0b)",
    },
  };

  const credibleUsersPerCategory = Math.floor(userStats.credible.length / (apiCategories?.length || 1));
  const leastCredibleUsersPerCategory = Math.floor(userStats.leastCredible.length / (apiCategories?.length || 1));

  const categories = apiCategories?.map((cat: any) => {
    const enhancement = categoryEnhancements[cat.title] || {
      icon: Target,
      trending: false,
      iconBg: "linear-gradient(135deg, #f59e0b, #ea580c)",
    };

    const credibleCount = enhancement.trending
      ? credibleUsersPerCategory + Math.floor(credibleUsersPerCategory * 0.3)
      : credibleUsersPerCategory;
    const leastCredibleCount = enhancement.trending
      ? leastCredibleUsersPerCategory
      : leastCredibleUsersPerCategory + Math.floor(leastCredibleUsersPerCategory * 0.2);

    return {
      ...cat,
      ...enhancement,
      participants: credibleCount + leastCredibleCount,
      credibleParticipants: credibleCount,
      leastCredibleParticipants: leastCredibleCount,
    };
  }) || [];

  const totalParticipants = totalUsers || categories.reduce((sum: number, cat: any) => sum + (cat.participants || 0), 0);
  const trendingCount = categories.filter((cat: any) => cat.trending).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-25/40 via-amber-25/30 to-yellow-25/40">

      <div className="relative pt-44 pb-20 px-4 sm:px-6 lg:px-[50px] overflow-hidden">

        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-br from-yellow-200 to-amber-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-br from-orange-200 to-red-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50/90 to-orange-50/90 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-amber-200/70 shadow-sm">
            <Target className="w-4 h-4 text-amber-700" />
            <span className="bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">Explore Categories</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 tracking-tight">
            Find Your
            <span className="block sm:inline bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
              {" "}Community
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Discover specialized communities where your expertise matters. Build reputation,
            share knowledge, and earn recognition for your unique contributions.
          </p>


          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-5xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-3xl font-bold bg-gradient-to-br from-amber-600 to-orange-600 bg-clip-text text-transparent mb-1">
                {categories.length}
              </div>
              <div className="text-sm text-gray-600 font-medium">Categories</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-3xl font-bold bg-gradient-to-br from-orange-600 to-red-600 bg-clip-text text-transparent mb-1">
                {totalParticipants.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 font-medium">Total Members</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-3xl font-bold bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                {userStats.credible.length}
              </div>
              <div className="text-sm text-gray-600 font-medium">Verified</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 shadow-sm hover:shadow-md transition-all duration-300 col-span-2 md:col-span-1">
              <div className="text-3xl font-bold bg-gradient-to-br from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-1">
                {trendingCount}
              </div>
              <div className="text-sm text-gray-600 font-medium">Trending</div>
            </div>
          </div>
        </div>
      </div>



      <div className="relative px-4 sm:px-6 lg:px-[50px] pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category: any, idx: number) => {
              const IconComponent = category.icon || Target;
              return (
                <NavLink
                  key={idx}
                  to={`/leaderboard/${category.title.split(" ").join("-").toLowerCase()}`}
                  className="group"
                >
                  <div
                    className="relative h-full p-8 rounded-3xl border border-amber-200/60 backdrop-blur-sm transition-all duration-500 overflow-hidden bg-white/80 hover:bg-white/90 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
                  >

                    <div className="absolute inset-0 bg-gradient-to-br from-white via-amber-25/30 to-orange-25/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>


                    {category.trending && (
                      <div className="absolute top-4 right-4 inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
                        <TrendingUp className="w-3 h-3" />
                        Trending
                      </div>
                    )}

                    <div className="relative z-10 flex flex-col h-full">

                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-all duration-300"
                        style={{
                          background: category.iconBg || category.color?.replace('from-', 'linear-gradient(135deg, ').replace(' to-', ', ') + ')' || 'linear-gradient(135deg, #f59e0b, #ea580c)'
                        }}
                      >
                        <IconComponent className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                      </div>


                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-amber-800 transition-colors duration-300">
                        {category.title}
                      </h3>

                      {category.desc && (
                        <p className="text-gray-600 mb-6 leading-relaxed flex-grow group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
                          {category.desc}
                        </p>
                      )}


                      <div className="flex items-center gap-6 mb-6">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-semibold text-gray-800">
                            {category.participants?.toLocaleString() || "0"}
                          </span>
                          <span className="text-xs text-gray-500">members</span>
                        </div>
                        {category.trending && (
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold text-green-700">
                              +12%
                            </span>
                          </div>
                        )}
                      </div>


                      <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                        <div className="flex items-center gap-2 text-amber-700 group-hover:text-amber-800 transition-colors duration-300">
                          <span className="text-sm font-semibold">Explore</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>


                    <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-amber-300/50 transition-all duration-500 pointer-events-none"></div>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>



      <div className="relative px-4 sm:px-6 lg:px-[50px] pb-32">
        <div className="max-w-4xl mx-auto text-center bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-amber-200/50 shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-md">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Join a Community?</h2>

          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Choose a category that matches your skills and interests. Start contributing, earn
            recognition, and build your reputation in the Web3 ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink
              to="#"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </NavLink>

            <NavLink
              to="#"
              className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-2xl font-semibold border border-amber-200 shadow-sm hover:shadow-md hover:bg-white transition-all duration-300"
            >
              Learn More
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
