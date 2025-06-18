import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router";
import { WalletConnect } from "~/components/WalletConnect";
import { Button } from "~/components/ui/button";
import { Users, Trophy, Search, User } from "lucide-react";

export const Navigation = () => {
  const [isConnected, setIsConnected] = useState(false);
  const location = useLocation();

  const handleWalletConnect = () => {
    setIsConnected(true);
  };

  const navItems = [
    { path: "/explorer", label: "Explorer", icon: Search },
    { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { path: "/profile", label: "Profile", icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-sm border-b border-waffle-syrup/20">
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-waffle-ocean rounded-lg flex items-center justify-center animate-waffle-bounce">
            🧇
          </div>
          <span className="text-2xl font-rounded font-bold text-waffle-ocean">Waffle</span>
        </Link>
      </motion.div>

      <div className="flex items-center gap-6">
        {isConnected && (
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className={`rounded-full font-rounded ${
                      isActive(item.path)
                        ? "bg-waffle-ocean text-white"
                        : "text-waffle-ocean hover:bg-waffle-cream"
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        )}

        <WalletConnect onConnect={handleWalletConnect} />
      </div>
    </nav>
  );
};
