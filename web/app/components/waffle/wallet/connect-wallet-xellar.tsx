import { ConnectButton, useConnectModal } from "@xellar/kit";
import { useAccount } from "wagmi";
import { ButtonMagnet } from "../button/magnet-button";
import { FIXED_CHAIN } from "~/constants/wagmi";
import { useEffect, useState } from "react";
import { ChevronDown, RefreshCcw } from "lucide-react";

export function ConnectWalletXellar() {
  const { isConnected, chain, address } = useAccount();
  const { open: openModalXellar } = useConnectModal();

  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  useEffect(() => {
    if (isConnected && chain?.id !== FIXED_CHAIN) {
      setIsWrongNetwork(true);
    } else {
      setIsWrongNetwork(false);
    }
  }, [chain]);

  return (
    <ConnectButton.Custom>
      {() => (
        <>
          {isConnected ? (
            <>
              <ButtonMagnet className="w-full sm:max-w-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
                  {isWrongNetwork ? (
                    <>
                      <RefreshCcw className="size-6" />
                      <span className="text-sm">Switch Network</span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm truncate">
                        <span className="hidden sm:inline">
                          {chain?.name} ~ {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
                        </span>
                        <span className="inline sm:hidden">
                          {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
                        </span>
                      </span>
                    </>
                  )}
                </div>
              </ButtonMagnet>
            </>
          ) : (
            <ButtonMagnet onClick={openModalXellar} className="w-full sm:w-auto">
              Connect Wallet
            </ButtonMagnet>
          )}
        </>
      )}
    </ConnectButton.Custom>
  );
}
