import { motion } from "framer-motion";
import { Navigation } from "~/components/Navigation";
import { TrustMeter } from "~/components/TrustMeter";
import { ReviewCard } from "~/components/ReviewCard";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Copy, Share2 } from "lucide-react";
import { toast } from "~/hooks/use-toast";

const Profile = () => {
  const userAddress = "0x742d35Cc6523Bb7E8A47E19c4B2c5F6A8B9E3D1C";
  const username = userAddress.slice(0, 10);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(userAddress);
    toast({
      title: "🧇 Address Copied!",
      description: "Your wallet address has been copied to clipboard",
    });
  };

  const shareProfile = () => {
    const profileUrl = `${window.location.origin}/${username}`;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "🧇 Profile Link Copied!",
      description: "Share this link so others can review you!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-waffle-cream via-white to-waffle-syrup">
      <Navigation />

      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Profile Header */}
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-waffle-syrup/20 rounded-2xl mb-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-waffle-teal to-waffle-ocean rounded-2xl flex items-center justify-center text-4xl">
                🧇
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-rounded font-bold text-waffle-ocean mb-2">
                  Your Profile
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-mono text-waffle-ocean">{formatAddress(userAddress)}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyAddress}
                    className="rounded-full"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={shareProfile}
                    className="rounded-full"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-gray-600 font-rounded">
                  Building trust one interaction at a time. Share your profile link to get reviews!
                </p>
              </div>
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Trust Score */}
            <div>
              <TrustMeter score={1000} maxScore={5000} />
            </div>

            {/* Recent Reviews */}
            <div>
              <h2 className="text-2xl font-rounded font-bold text-waffle-ocean mb-6">
                Recent Reviews
              </h2>
              <div className="space-y-4">
                <ReviewCard
                  reviewer="0x8f4E9B2a1C3d5e7"
                  rating="positive"
                  comment="Super reliable trader! Quick responses and honest dealings. Would definitely work with again! 🌟"
                  timestamp="2 hours ago"
                />
                <ReviewCard
                  reviewer="0x1a2B3c4D5e6F7g8"
                  rating="positive"
                  comment="Great communication and followed through on promises. Trustworthy!"
                  timestamp="1 day ago"
                />
                <ReviewCard
                  reviewer="0x9h8I7j6K5l4M3n2"
                  rating="negative"
                  comment="Transaction took longer than expected, but was resolved eventually."
                  timestamp="3 days ago"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
