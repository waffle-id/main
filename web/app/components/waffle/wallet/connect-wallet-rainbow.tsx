// import { ConnectButton, useConnectModal } from "@xellar/kit";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSwitchChain } from "wagmi";
import { ButtonMagnet } from "../button/magnet-button";
import { ChevronDown, Hash, House, LogOut, RefreshCcw, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/shadcn/dropdown-menu";
import { monadTestnet } from "viem/chains";
import { NavLink } from "react-router";

export function ConnectWalletRainbow() {
  const { isConnected, chain, address } = useAccount();

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div>
            {(() => {
              if (!connected) {
                return (
                  <ButtonMagnet className="w-full sm:w-auto" onClick={openConnectModal}>
                    Connect Wallet
                  </ButtonMagnet>
                );
              }

              if (chain.unsupported) {
                return (
                  <ButtonMagnet
                    className="w-full sm:max-w-xs"
                    // onClick={() => switchChain?.({ chainId: monadTestnet.id })}
                    onClick={openChainModal}
                  >
                    <div className="flex flex-row items-center gap-2">
                      <RefreshCcw className="size-5" />
                      <span className="text-sm">Switch Network</span>
                    </div>
                  </ButtonMagnet>
                );
              }

              return (
                <>
                  {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div>
                        <ButtonMagnet>
                          <div className="flex flex-row items-center gap-4">
                            {chain.unsupported ? (
                              "Wrong Network"
                            ) : (
                              <>
                                {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
                                <ChevronDown className="size-4 transition-transform" />
                              </>
                            )}
                          </div>
                        </ButtonMagnet>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-48">
                      {chain.unsupported && (
                        <DropdownMenuItem className="py-4" onClick={openChainModal}>
                          Change Network
                          <DropdownMenuShortcut>
                            <RefreshCcw className="size-5" />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                      )}
                      <NavLink to="/">
                        <DropdownMenuItem className="py-4">
                          Home
                          <DropdownMenuShortcut>
                            <House className="size-5" />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </NavLink>
                      <NavLink to="/categories">
                        <DropdownMenuItem className="py-4">
                          Categories
                          <DropdownMenuShortcut>
                            <Hash className="size-5" />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </NavLink>
                      <NavLink to={`/profile/w/${address}`}>
                        <DropdownMenuItem className="py-4">
                          My Profile
                          <DropdownMenuShortcut>
                            <User />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </NavLink>
                      <DropdownMenuItem className="py-4" onClick={openAccountModal}>
                        Log out
                        <DropdownMenuShortcut>
                          <LogOut />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> */}

                  <ButtonMagnet className="w-full sm:max-w-xs" onClick={openAccountModal}>
                    <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
                      <span className="truncate">
                        <span className="hidden sm:inline">
                          {chain?.name} ~ {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
                        </span>
                        <span className="inline sm:hidden">
                          {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
                        </span>
                      </span>
                    </div>
                  </ButtonMagnet>
                </>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
