import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Coins } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface WalletConnectProps {
  onConnect: () => void;
}

export const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const handleConnect = async () => {
    setIsConnecting(true);

    // Simulate wallet connection
    setTimeout(() => {
      const mockAddress = "0x742d35Cc6523Bb7E8A47E19c4B2c5F6A8B9E3D1C";
      setWalletAddress(mockAddress);
      setIsConnected(true);
      setIsConnecting(false);
      onConnect();

      toast({
        title: "🧇 Welcome to Waffle!",
        description: "Your wallet is connected. Time to build some trust!",
      });
    }, 1500);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="px-4 py-2 bg-waffle-cream border-waffle-ocean/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <Coins className="w-4 h-4 text-waffle-ocean" />
            <span className="font-mono text-sm text-waffle-ocean">
              {formatAddress(walletAddress)}
            </span>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className="bg-waffle-teal hover:bg-waffle-ocean text-white rounded-2xl px-6 py-2 font-rounded font-medium transition-all duration-300 transform hover:scale-105"
    >
      {isConnecting ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 mr-2"
        >
          🧇
        </motion.div>
      ) : (
        <Coins className="w-4 h-4 mr-2" />
      )}
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
};
