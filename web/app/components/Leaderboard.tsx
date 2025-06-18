import { motion } from "framer-motion";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Star, Crown, Award } from "lucide-react";
import { useState } from "react";

export const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState<"trusted" | "active">("trusted");

  const topUsers = [
    {
      rank: 1,
      address: "0x8f4E9B2a1C3d5e7",
      trustScore: 4850,
      badge: "🧇✨",
      title: "Golden Waffle Master",
      reviews: 156,
    },
    {
      rank: 2,
      address: "0x742d35Cc6523Bb7",
      trustScore: 4200,
      badge: "👨‍🍳",
      title: "Trusted Baker",
      reviews: 89,
    },
    {
      rank: 3,
      address: "0x1a2B3c4D5e6F7g8",
      trustScore: 3950,
      badge: "⭐",
      title: "Rising Star",
      reviews: 67,
    },
    {
      rank: 4,
      address: "0x9h8I7j6K5l4M3n2",
      trustScore: 3400,
      badge: "🧇",
      title: "Fresh Waffle",
      reviews: 45,
    },
    {
      rank: 5,
      address: "0x2O1p3Q4r5S6t7U8",
      trustScore: 3100,
      badge: "🧇",
      title: "Fresh Waffle",
      reviews: 34,
    },
  ];

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Award className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Star className="w-5 h-5 text-yellow-600" />;
      default:
        return <span className="text-lg font-bold text-waffle-ocean">#{rank}</span>;
    }
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-waffle-syrup/20 rounded-2xl">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === "trusted" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("trusted")}
          className={`rounded-full font-rounded ${
            activeTab === "trusted"
              ? "bg-waffle-ocean text-white"
              : "text-waffle-ocean hover:bg-waffle-cream"
          }`}
        >
          Most Trusted
        </Button>
        <Button
          variant={activeTab === "active" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("active")}
          className={`rounded-full font-rounded ${
            activeTab === "active"
              ? "bg-waffle-ocean text-white"
              : "text-waffle-ocean hover:bg-waffle-cream"
          }`}
        >
          Most Active
        </Button>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {topUsers.map((user, index) => (
          <motion.div
            key={user.address}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-waffle-cream/50 ${
              user.rank <= 3 ? "bg-gradient-to-r from-waffle-cream/30 to-waffle-syrup/20" : ""
            }`}
          >
            {/* Rank */}
            <div className="flex items-center justify-center w-8 h-8">{getRankIcon(user.rank)}</div>

            {/* Badge */}
            <motion.div
              className="text-2xl"
              animate={
                user.rank === 1
                  ? {
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1],
                    }
                  : {}
              }
              transition={{
                duration: 2,
                repeat: user.rank === 1 ? Infinity : 0,
                ease: "easeInOut",
              }}
            >
              {user.badge}
            </motion.div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-sm text-waffle-ocean font-medium">
                  {formatAddress(user.address)}
                </span>
                {user.rank <= 3 && (
                  <span className="text-xs bg-waffle-syrup text-waffle-ocean px-2 py-1 rounded-full font-rounded">
                    {user.title}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 font-rounded">
                <span>{user.trustScore.toLocaleString()} trust</span>
                <span>•</span>
                <span>{user.reviews} reviews</span>
              </div>
            </div>

            {/* Trust Score Animation */}
            <motion.div className="text-right" whileHover={{ scale: 1.05 }}>
              <div className="text-lg font-rounded font-bold text-waffle-ocean">
                {user.trustScore.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 font-rounded">trust score</div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <p className="text-sm text-gray-500 font-rounded">
          🧇 Early Access: <span className="font-semibold">2,847</span> / 10,000 wallets
        </p>
      </motion.div>
    </Card>
  );
};
