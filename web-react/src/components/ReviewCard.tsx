import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Heart, Shield } from "lucide-react";

interface ReviewCardProps {
  reviewer: string;
  rating: "positive" | "negative";
  comment: string;
  timestamp: string;
}

export const ReviewCard = ({ reviewer, rating, comment, timestamp }: ReviewCardProps) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="animate-fade-in-up"
    >
      <Card className="p-4 bg-white/80 backdrop-blur-sm border-waffle-syrup/20 rounded-2xl hover:shadow-md transition-all duration-300">
        <div className="flex items-start gap-3">
          {/* Rating Icon */}
          <motion.div
            className={`p-2 rounded-full ${
              rating === "positive" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {rating === "positive" ? (
              <Heart className="w-4 h-4 fill-current" />
            ) : (
              <Shield className="w-4 h-4" />
            )}
          </motion.div>

          <div className="flex-1">
            {/* Reviewer Info */}
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-sm text-waffle-ocean font-medium">
                {formatAddress(reviewer)}
              </span>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <span className="text-xs text-gray-500 font-rounded">{timestamp}</span>
            </div>

            {/* Comment */}
            <motion.p
              className="text-gray-700 font-rounded leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {comment}
            </motion.p>
          </div>
        </div>

        {/* Waffle Pattern Border */}
        <motion.div
          className="mt-3 h-1 bg-gradient-to-r from-waffle-syrup via-waffle-cream to-waffle-syrup rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />
      </Card>
    </motion.div>
  );
};
