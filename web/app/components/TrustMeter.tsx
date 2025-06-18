import { motion } from "framer-motion";
import { Card } from "~/components/ui/card";
import { Shield } from "lucide-react";

interface TrustMeterProps {
  score: number;
  maxScore: number;
}

export const TrustMeter = ({ score, maxScore }: TrustMeterProps) => {
  const percentage = (score / maxScore) * 100;

  const getTrustLevel = (score: number) => {
    if (score >= 4000) return { level: "Golden Waffle", color: "text-yellow-600", emoji: "🧇✨" };
    if (score >= 3000) return { level: "Trusted Baker", color: "text-waffle-ocean", emoji: "👨‍🍳" };
    if (score >= 2000) return { level: "Rising Star", color: "text-waffle-teal", emoji: "⭐" };
    if (score >= 1000) return { level: "Fresh Waffle", color: "text-waffle-coral", emoji: "🧇" };
    return { level: "New to the Kitchen", color: "text-gray-500", emoji: "🥚" };
  };

  const trustLevel = getTrustLevel(score);

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-waffle-syrup/20 rounded-2xl">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-6 h-6 text-waffle-ocean" />
        <h3 className="text-xl font-rounded font-semibold text-waffle-ocean">Trust Score</h3>
      </div>

      <div className="space-y-4">
        {/* Trust Level Badge */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">{trustLevel.emoji}</span>
          <span className={`font-rounded font-semibold ${trustLevel.color}`}>
            {trustLevel.level}
          </span>
        </div>

        {/* Score Display */}
        <div className="flex items-baseline gap-2">
          <motion.span
            className="text-4xl font-rounded font-bold text-waffle-ocean"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            {score.toLocaleString()}
          </motion.span>
          <span className="text-gray-500 font-rounded">/ {maxScore.toLocaleString()}</span>
        </div>

        {/* Syrup Meter */}
        <div className="relative">
          <div className="w-full h-8 bg-waffle-cream rounded-full border-2 border-waffle-syrup/30 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-waffle-syrup to-waffle-coral rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              {/* Syrup drip effect */}
              <motion.div
                className="absolute top-0 right-0 w-2 h-2 bg-waffle-coral rounded-full"
                animate={{
                  y: [0, 4, 0],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>

          <motion.div
            className="mt-2 text-sm text-gray-600 text-center font-rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            {percentage.toFixed(1)}% to next level
          </motion.div>
        </div>

        {/* Trust Glow Effect */}
        <motion.div
          className="flex justify-center"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-waffle-teal/20 to-waffle-ocean/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">✨</span>
          </div>
        </motion.div>
      </div>
    </Card>
  );
};
