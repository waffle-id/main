import axios from "axios";
import { NavLink, useLoaderData } from "react-router";
import { cn } from "~/utils/cn";
import type { Route } from "./+types";
import { generateSEO, SEO_CONFIGS } from "~/utils/seo";
import { fetchUsers, categorizeUsersByReputation, type User } from "~/services/users";

export function meta(): Route.MetaDescriptors {
  return generateSEO(SEO_CONFIGS.categories);
}

import {
  TrendingUp,
  Users,
  Star,
  ArrowRight,
  Sparkles,
  Target,
  Award,
  Crown,
  Code,
  Heart,
  Zap,
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

const FALLBACK_CATEGORIES = [
  {
    title: "Development",
    desc: "Builders, coders, and creators advancing Web3 technology",
    images: "https://ik.imagekit.io/3592mo0vh/waffle/dev.svg",
    icon: Code,
    participants: 0,
    trending: true,
    color: "from-blue-500 to-cyan-500",
    bgPattern: "bg-gradient-to-br from-blue-50 to-cyan-50",
  },
  {
    title: "Community",
    desc: "Contributors fostering growth and engagement",
    images: "https://ik.imagekit.io/3592mo0vh/waffle/community.svg",
    icon: Users,
    participants: 0,
    trending: false,
    color: "from-green-500 to-emerald-500",
    bgPattern: "bg-gradient-to-br from-green-50 to-emerald-50",
  },
  {
    title: "Creator",
    desc: "Content creators and storytellers",
    images: "https://ik.imagekit.io/3592mo0vh/waffle/creator.svg",
    icon: Sparkles,
    participants: 0,
    trending: true,
    color: "from-purple-500 to-pink-500",
    bgPattern: "bg-gradient-to-br from-purple-50 to-pink-50",
  },
  {
    title: "Leadership",
    desc: "Visionaries leading projects and initiatives",
    images: "https://ik.imagekit.io/3592mo0vh/waffle/leadership.svg",
    icon: Crown,
    participants: 0,
    trending: false,
    color: "from-yellow-500 to-orange-500",
    bgPattern: "bg-gradient-to-br from-yellow-50 to-orange-50",
  },
  {
    title: "Support",
    desc: "Helpers and mentors supporting the community",
    images: "https://ik.imagekit.io/3592mo0vh/waffle/support.svg",
    icon: Heart,
    participants: 0,
    trending: false,
    color: "from-rose-500 to-pink-500",
    bgPattern: "bg-gradient-to-br from-rose-50 to-pink-50",
  },
  {
    title: "Innovation",
    desc: "Pioneers pushing boundaries in Web3",
    images: "https://ik.imagekit.io/3592mo0vh/waffle/innovation.svg",
    icon: Zap,
    participants: 0,
    trending: true,
    color: "from-indigo-500 to-purple-500",
    bgPattern: "bg-gradient-to-br from-indigo-50 to-purple-50",
  },
];

export default function CategoriesPage() {
  const loaderData = useLoaderData<typeof loader>();
  const { categories: apiCategories, userStats, totalUsers } = loaderData;


  const credibleUsersPerCategory = Math.floor(userStats.credible.length / FALLBACK_CATEGORIES.length);
  const leastCredibleUsersPerCategory = Math.floor(userStats.leastCredible.length / FALLBACK_CATEGORIES.length);

  const categories =
    apiCategories?.length > 0
      ? apiCategories.map((cat: any, idx: number) => {
        const categoryConfig = FALLBACK_CATEGORIES[idx % FALLBACK_CATEGORIES.length];

        const credibleCount = categoryConfig.trending
          ? credibleUsersPerCategory + Math.floor(credibleUsersPerCategory * 0.3)
          : credibleUsersPerCategory;
        const leastCredibleCount = categoryConfig.trending
          ? leastCredibleUsersPerCategory
          : leastCredibleUsersPerCategory + Math.floor(leastCredibleUsersPerCategory * 0.2);

        return {
          ...cat,
          ...categoryConfig,
          title: cat.title,
          images: cat.images,
          participants: credibleCount + leastCredibleCount,
          credibleParticipants: credibleCount,
          leastCredibleParticipants: leastCredibleCount,
        };
      })
      : FALLBACK_CATEGORIES.map((cat, idx) => {
        const credibleCount = cat.trending
          ? credibleUsersPerCategory + Math.floor(credibleUsersPerCategory * 0.3)
          : credibleUsersPerCategory;
        const leastCredibleCount = cat.trending
          ? leastCredibleUsersPerCategory
          : leastCredibleUsersPerCategory + Math.floor(leastCredibleUsersPerCategory * 0.2);

        return {
          ...cat,
          participants: credibleCount + leastCredibleCount,
          credibleParticipants: credibleCount,
          leastCredibleParticipants: leastCredibleCount,
        };
      });

  const totalParticipants = totalUsers || categories.reduce((sum: number, cat: any) => sum + (cat.participants || 0), 0);
  const trendingCount = categories.filter((cat: any) => cat.trending).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-orange-25 to-orange-50">

      <div className="relative pt-44 pb-16 px-[20px] lg:px-[50px] overflow-hidden">

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full text-sm text-orange-700 font-medium mb-6 border border-orange-200">
            <Target className="w-4 h-4" />
            Explore Categories
          </div>

          <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Find Your
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              {" "}
              Community
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover different communities where you can contribute, learn, and earn recognition for
            your unique skills and passions.
          </p>


          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{categories.length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {totalParticipants.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Participants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{userStats.credible.length}</div>
              <div className="text-sm text-gray-600">Credible (1000+ pts)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{trendingCount}</div>
              <div className="text-sm text-gray-600">Trending</div>
            </div>
          </div>
        </div>
      </div>


      <div className="px-[20px] lg:px-[50px] pb-20">
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
                    className={cn(
                      "relative h-full p-8 rounded-3xl border border-gray-200/50 backdrop-blur-sm transition-all duration-300 overflow-hidden",
                      "hover:-translate-y-2 hover:border-gray-300",
                      category.bgPattern || "bg-gradient-to-br from-gray-50 to-gray-100"

                    )}
                  >

                    <div
                      className={cn(
                        "absolute inset-0 opacity-0 transition-opacity duration-300",
                        `bg-gradient-to-br ${category.color || "from-gray-400 to-gray-600"}`
                      )}
                    />


                    {category.trending && (
                      <div className="absolute top-4 right-4 inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        <TrendingUp className="w-3 h-3" />
                        Trending
                      </div>
                    )}


                    <div className="relative z-10 flex flex-col h-full">

                      <div
                        className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300",
                          `bg-gradient-to-br ${category.color || "from-gray-400 to-gray-600"}`

                        )}
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>


                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                        {category.title}
                      </h3>

                      {category.desc && (
                        <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                          {category.desc}
                        </p>
                      )}


                      <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          {category.participants?.toLocaleString() || "0"} members
                        </div>

                        <div className="flex items-center gap-1 text-orange-600 font-medium text-sm  transition-all duration-300">
                          Explore
                          <ArrowRight className="w-4 h-4 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>


                    <div className="absolute inset-0 opacity-0 transition-opacity duration-300">
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `radial-gradient(circle at 50% 50%, currentColor 1px, transparent 1px)`,
                          backgroundSize: "24px 24px",
                        }}
                      />
                    </div>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>


      <div className="px-[20px] lg:px-[50px] pb-32">
        <div className="max-w-4xl mx-auto text-center bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-gray-200/50">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl">
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
              to="/leaderboard"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Star className="w-5 h-5" />
              View Leaderboard
            </NavLink>

            <NavLink
              to="/badges"
              className="inline-flex items-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-full font-semibold border border-gray-300 hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Award className="w-5 h-5" />
              Explore Badges
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
