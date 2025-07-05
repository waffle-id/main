import axios from "axios";
import { useState } from "react";
import { useLoaderData } from "react-router";
import { Badge } from "~/components/shadcn/badge";
import { TextStaticAnimation } from "~/components/waffle/logo/text-static-animation";
import { Award, Star, Trophy, Target, Users, Zap, Shield, Heart, Crown, Code } from "lucide-react";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";

export async function loader() {
  try {
    const badges = await axios
      .get("https://api.waffle.food/badges")
      .then<Record<string, string>[]>((resp) => resp.data.data);
    return { badges };
  } catch (error) {
    return { badges: [] }; // Fallback for API errors
  }
}

const FALLBACK_BADGES = [
  {
    title: "Contributor",
    desc: "Made significant contributions to the community through helpful content and support",
    images: "https://ik.imagekit.io/3592mo0vh/waffle/contrib.svg",
    category: "Community",
    rarity: "Common",
    icon: Users,
    earned: 1250,
    color: "from-blue-400 to-blue-600",
  },
  {
    title: "Supportive",
    desc: "Consistently helps and supports other community members with kindness",
    images: "https://ik.imagekit.io/3592mo0vh/waffle/support.svg",
    category: "Social",
    rarity: "Uncommon",
    icon: Heart,
    earned: 890,
    color: "from-pink-400 to-rose-600",
  },
  {
    title: "Builder",
    desc: "Creates and builds amazing projects that advance the Web3 ecosystem",
    images: "https://ik.imagekit.io/3592mo0vh/waffle/build.svg",
    category: "Development",
    rarity: "Rare",
    icon: Code,
    earned: 567,
    color: "from-green-400 to-emerald-600",
  },
  {
    title: "Pioneer",
    desc: "Early adopter and trendsetter who pushes boundaries in the Web3 space",
    images: "https://ik.imagekit.io/3592mo0vh/waffle/pioneer.svg",
    category: "Achievement",
    rarity: "Epic",
    icon: Star,
    earned: 234,
    color: "from-purple-400 to-violet-600",
  },
  {
    title: "Guardian",
    desc: "Protects and secures the community through vigilance and expertise",
    images: "https://ik.imagekit.io/3592mo0vh/waffle/guardian.svg",
    category: "Security",
    rarity: "Legendary",
    icon: Shield,
    earned: 89,
    color: "from-orange-400 to-red-600",
  },
  {
    title: "Innovator",
    desc: "Brings groundbreaking ideas and revolutionary solutions to life",
    images: "https://ik.imagekit.io/3592mo0vh/waffle/innovator.svg",
    category: "Innovation",
    rarity: "Mythic",
    icon: Zap,
    earned: 23,
    color: "from-pink-400 via-purple-500 to-indigo-600",
  },
];

const RARITY_STYLES: Record<string, string> = {
  Common: "from-gray-400 to-gray-600 border-gray-300",
  Uncommon: "from-green-400 to-green-600 border-green-300",
  Rare: "from-blue-400 to-blue-600 border-blue-300",
  Epic: "from-purple-400 to-purple-600 border-purple-300",
  Legendary: "from-orange-400 to-orange-600 border-orange-300",
  Mythic: "from-pink-400 via-purple-500 to-indigo-600 border-pink-300",
};

export default function BadgesPage() {
  const loaderData = useLoaderData<typeof loader>();
  const { badges: apiBadges } = loaderData;
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Use API badges if available, otherwise use fallback
  const badges =
    apiBadges && apiBadges.length > 0
      ? apiBadges.map((badge, idx) => ({
          ...badge,
          ...FALLBACK_BADGES[idx % FALLBACK_BADGES.length],
          title: badge.title,
          desc: badge.desc,
          images: badge.images,
        }))
      : FALLBACK_BADGES;

  const categories = ["All", ...Array.from(new Set(badges.map((badge) => badge.category)))];
  const filteredBadges =
    selectedCategory === "All"
      ? badges
      : badges.filter((badge) => badge.category === selectedCategory);

  return (
    <div className="mt-32 px-[20px] lg:px-[50px] min-h-screen">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
        <div className="flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-4">
            <Badge className="w-max bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 border-orange-200">
              <Award className="size-4 mr-2" />
              Achievement System
            </Badge>
            <h1 className="text-6xl font-bold text-gray-900 leading-tight">
              Earn Your
              <span className="block bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Recognition
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-md">
              Build your reputation through meaningful contributions and unlock exclusive badges
              that showcase your impact in the Web3 community.
            </p>
          </div>

          <div className="flex gap-4 mt-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{badges.length}</div>
              <div className="text-sm text-gray-500">Available Badges</div>
            </div>
            <div className="w-px bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {badges.reduce((sum, badge) => sum + (badge.earned || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Total Earned</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative">
            {/* <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full opacity-60"></div> */}
            <TextStaticAnimation className="relative z-10 w-[500px] h-[500px]" />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg"
                  : "bg-white text-gray-600 border-2 border-gray-200 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        {filteredBadges.map((badge, idx) => {
          const IconComponent = badge.icon || Award;
          const rarity = badge.rarity || "Common";
          const rarityStyle = RARITY_STYLES[rarity] || RARITY_STYLES.Common;

          return (
            <div
              key={idx}
              className="group relative bg-gradient-to-br from-white to-orange-50/30 rounded-3xl p-8 border-2 border-orange-200/50 shadow-lg transition-all duration-500 overflow-hidden"
            >
              {/* Background Effects */}
              {/* <div className="absolute inset-0 bg-gradient-to-br from-orange-100/10 to-yellow-100/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div> */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-orange-300/20 to-yellow-400/20 rounded-full transition-transform duration-700"></div>

              {/* Rarity Indicator */}
              <div
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${rarityStyle} shadow-md`}
              >
                {rarity}
              </div>

              <div className="relative z-10 flex flex-col items-center gap-6">
                {/* Badge Image Container */}
                <div className="relative group/badge">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${rarityStyle} rounded-full shadow-lg`}
                  ></div>
                  <div className="relative bg-white rounded-full p-6 shadow-inner">
                    <img
                      src={badge.images}
                      className="size-20 object-contain"
                      alt={badge.title}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                    <IconComponent
                      className={`size-20 hidden ${
                        badge.color
                          ? `bg-gradient-to-br ${badge.color} bg-clip-text text-transparent`
                          : "text-orange-500"
                      }`}
                    />
                  </div>

                  {/* Floating animation elements */}
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
                  <div
                    className="absolute -bottom-2 -left-2 w-2 h-2 bg-orange-400 rounded-full animate-bounce opacity-40"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                </div>

                {/* Badge Info */}
                <div className="text-center space-y-3">
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-orange-600">
                    {badge.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{badge.desc}</p>

                  {/* Category and Stats */}
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                      {badge.category}
                    </Badge>
                    {badge.earned && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Trophy className="size-4" />
                        {badge.earned.toLocaleString()} earned
                      </div>
                    )}
                  </div>
                </div>

                {/* Earn Button */}
                <ButtonMagnet className="w-full">
                  <div className="flex flex-row items-center justify-center gap-2">
                    <Award className="size-4" />
                    Earn This Badge
                    <span className="text-xs group-hover/btn:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </div>
                </ButtonMagnet>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="text-center pt-16 pb-32 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl border-2 border-orange-200/50 mb-16">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex justify-center mb-4">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                    Object.values(RARITY_STYLES)[i]
                  } border-2 border-white shadow-md`}
                ></div>
              ))}
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900">Ready to Start Earning?</h2>
          <p className="text-xl text-gray-600">
            Join the community, contribute meaningfully, and unlock exclusive badges that represent
            your journey in Web3.
          </p>
          <ButtonMagnet>Start Your Journey</ButtonMagnet>
        </div>
      </div>
    </div>
  );
}
