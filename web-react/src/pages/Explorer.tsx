import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Explorer = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const sampleProfiles = [
    {
      address: "0x8f4E9B2a1C3d5e7F8B9C0D1E2F3A4B5C6D7E8F9",
      username: "0x8f4E9B2a1C",
      trustScore: 4850,
      reviewCount: 156,
      badge: "🧇✨",
      title: "Golden Waffle Master",
    },
    {
      address: "0x742d35Cc6523Bb7E8A47E19c4B2c5F6A8B9E3D1C",
      username: "0x742d35Cc6",
      trustScore: 4200,
      reviewCount: 89,
      badge: "👨‍🍳",
      title: "Trusted Baker",
    },
    {
      address: "0x1a2B3c4D5e6F7g8H9I0J1K2L3M4N5O6P7Q8R9S0",
      username: "0x1a2B3c4D5",
      trustScore: 3950,
      reviewCount: 67,
      badge: "⭐",
      title: "Rising Star",
    },
    {
      address: "0x9h8I7j6K5l4M3n2O1p0Q9r8S7t6U5v4W3x2Y1z0",
      username: "0x9h8I7j6K5",
      trustScore: 3400,
      reviewCount: 45,
      badge: "🧇",
      title: "Fresh Waffle",
    },
  ];

  const filteredProfiles = sampleProfiles.filter(
    (profile) =>
      profile.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-waffle-cream via-white to-waffle-syrup">
      <Navigation />

      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-rounded font-bold text-waffle-ocean mb-4">
              🔍 Explore Profiles
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover and review wallets in the Waffle community
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by address or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-2xl border-waffle-syrup/30 focus:border-waffle-ocean"
              />
            </div>
          </div>

          {/* Profile Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredProfiles.map((profile, index) => (
              <motion.div
                key={profile.address}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="p-6 bg-white/80 backdrop-blur-sm border-waffle-syrup/20 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{profile.badge}</div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-mono text-lg font-semibold text-waffle-ocean">
                          {profile.username}
                        </h3>
                        <span className="text-xs bg-waffle-syrup text-waffle-ocean px-2 py-1 rounded-full font-rounded">
                          {profile.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-waffle-teal fill-current" />
                          <span>{profile.trustScore.toLocaleString()}</span>
                        </div>
                        <span>•</span>
                        <span>{profile.reviewCount} reviews</span>
                      </div>

                      <Link to={`/${profile.username}`}>
                        <Button className="w-full bg-waffle-ocean hover:bg-waffle-teal text-white rounded-xl">
                          View Profile & Review
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredProfiles.length === 0 && searchQuery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🧇</div>
              <h3 className="text-xl font-rounded font-semibold text-waffle-ocean mb-2">
                No profiles found
              </h3>
              <p className="text-gray-600">Try searching with a different address or username</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Explorer;
