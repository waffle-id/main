import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Leaderboard as LeaderboardComponent } from "@/components/Leaderboard";

const Leaderboard = () => {
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
              🏆 Trust Leaders
            </h1>
            <p className="text-xl text-gray-600">
              See who's building the strongest reputation in the Waffle community
            </p>
          </div>

          <LeaderboardComponent />
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
