import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { TrustMeter } from "@/components/TrustMeter";
import { ReviewCard } from "@/components/ReviewCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Shield, Minus, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const UserProfile = () => {
  const { username } = useParams();
  const [selectedRating, setSelectedRating] = useState<"positive" | "negative" | "neutral" | null>(
    null
  );
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock user data - in real app this would come from the username
  const userData = {
    address: "0x8f4E9B2a1C3d5e7F8B9C0D1E2F3A4B5C6D7E8F9",
    username: username || "0x8f4E9B2a1C",
    trustScore: 4850,
    maxScore: 5000,
    reviewCount: 156,
    badge: "🧇✨",
    title: "Golden Waffle Master",
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(userData.address);
    toast({
      title: "🧇 Address Copied!",
      description: "Wallet address copied to clipboard",
    });
  };

  const handleSubmitReview = async () => {
    if (!selectedRating || !reviewComment.trim()) {
      toast({
        title: "⚠️ Incomplete Review",
        description: "Please select a rating and write a comment",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSelectedRating(null);
      setReviewComment("");

      toast({
        title: "🧇 Review Submitted!",
        description: "Your review has been added to the blockchain",
      });
    }, 1500);
  };

  const ratingOptions = [
    { type: "positive" as const, icon: Heart, label: "Positive", color: "green" },
    { type: "neutral" as const, icon: Minus, label: "Neutral", color: "yellow" },
    { type: "negative" as const, icon: Shield, label: "Negative", color: "red" },
  ];

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
                {userData.badge}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-rounded font-bold text-waffle-ocean">
                    {userData.username}
                  </h1>
                  <span className="text-sm bg-waffle-syrup text-waffle-ocean px-3 py-1 rounded-full font-rounded">
                    {userData.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-mono text-waffle-ocean">
                    {formatAddress(userData.address)}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyAddress}
                    className="rounded-full"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-gray-600 font-rounded">
                  {userData.reviewCount} reviews • Trust Score:{" "}
                  {userData.trustScore.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Trust Score & Review Form */}
            <div className="space-y-8">
              <TrustMeter score={userData.trustScore} maxScore={userData.maxScore} />

              {/* Review Form */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-waffle-syrup/20 rounded-2xl">
                <h3 className="text-xl font-rounded font-semibold text-waffle-ocean mb-6">
                  Leave a Review
                </h3>

                {/* Rating Selection */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {ratingOptions.map((option) => {
                    const IconComponent = option.icon;
                    const isSelected = selectedRating === option.type;

                    return (
                      <Button
                        key={option.type}
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => setSelectedRating(option.type)}
                        className={`flex flex-col items-center gap-2 p-4 h-auto rounded-xl ${
                          isSelected
                            ? option.color === "green"
                              ? "bg-green-500 hover:bg-green-600 text-white"
                              : option.color === "yellow"
                              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                              : "bg-red-500 hover:bg-red-600 text-white"
                            : "hover:bg-waffle-cream"
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span className="text-sm font-rounded">{option.label}</span>
                      </Button>
                    );
                  })}
                </div>

                {/* Comment */}
                <Textarea
                  placeholder="Share your experience with this wallet... Keep it thoughtful like a fresh waffle! 🧇"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="mb-4 min-h-[100px] rounded-xl border-waffle-syrup/30 focus:border-waffle-ocean"
                />

                <Button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || !selectedRating || !reviewComment.trim()}
                  className="w-full bg-waffle-ocean hover:bg-waffle-teal text-white rounded-xl"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 mr-2"
                    >
                      🧇
                    </motion.div>
                  ) : null}
                  {isSubmitting ? "Submitting Review..." : "Submit Review"}
                </Button>
              </Card>
            </div>

            {/* Right Column - Reviews */}
            <div>
              <h2 className="text-2xl font-rounded font-bold text-waffle-ocean mb-6">
                Reviews ({userData.reviewCount})
              </h2>
              <div className="space-y-4">
                <ReviewCard
                  reviewer="0x742d35Cc6523Bb7"
                  rating="positive"
                  comment="Incredible trader! Fast, reliable, and great communication throughout our DeFi swap. Highly recommend! 🌟"
                  timestamp="3 hours ago"
                />
                <ReviewCard
                  reviewer="0x1a2B3c4D5e6F7g8"
                  rating="positive"
                  comment="Smooth NFT transaction. Delivered exactly as promised. Trustworthy wallet!"
                  timestamp="1 day ago"
                />
                <ReviewCard
                  reviewer="0x9h8I7j6K5l4M3n2"
                  rating="positive"
                  comment="Great experience in our multi-sig collaboration. Professional and reliable."
                  timestamp="2 days ago"
                />
                <ReviewCard
                  reviewer="0x3f2E1d4C5b6A7s8"
                  rating="negative"
                  comment="Transaction was delayed longer than agreed, but eventually resolved."
                  timestamp="1 week ago"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;
