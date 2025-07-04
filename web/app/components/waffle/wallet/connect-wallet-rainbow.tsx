// import { ConnectButton, useConnectModal } from "@xellar/kit";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSwitchChain, useDisconnect } from "wagmi";
import { ButtonMagnet } from "../button/magnet-button";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Hash,
  House,
  LogOut,
  RefreshCcw,
  User,
  Twitter,
  X,
  Award,
  BadgeCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/shadcn/dropdown-menu";

import { NavLink, Form, useLoaderData } from "react-router";
import { ConnectTwitter, type ConnectTwitterRef } from "./shared/connect-twitter";
import { useWaffleProvider } from "../waffle-provider";

export function ConnectWalletRainbow() {
  const { isConnected, chain, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { twitterUser } = useWaffleProvider();

  const connectXRef = useRef<ConnectTwitterRef>(null);
  const [dropdownOpenControl, setDropdownOpenControl] = useState(false);

  const handleDisconnect = () => {
    disconnect();

    localStorage.removeItem("waffle_wallet_address");
    localStorage.removeItem("waffle_referral_code");
    // setHasValidInvitation(false);
    // setValidatedInvitationCode("");
  };

  useEffect(() => {
    if (isConnected && address) {
      localStorage.setItem("waffle_wallet_address", address);
    } else {
      localStorage.removeItem("waffle_wallet_address");
    }
  }, [isConnected, address]);

  return (
    <>
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
                    <ButtonMagnet className="w-full sm:max-w-xs" onClick={openChainModal}>
                      <div className="flex flex-row items-center gap-2">
                        <RefreshCcw className="size-5" />
                        <span className="text-sm">Switch Network</span>
                      </div>
                    </ButtonMagnet>
                  );
                }

                return (
                  <>
                    <DropdownMenu open={dropdownOpenControl}>
                      <DropdownMenuTrigger asChild>
                        <div>
                          <ButtonMagnet>
                            <div
                              className="flex flex-row items-center gap-4"
                              onClick={() => setDropdownOpenControl(true)}
                            >
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
                      <DropdownMenuContent
                        align="center"
                        className="w-48"
                        onPointerDownOutside={() => setDropdownOpenControl(false)}
                      >
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

                        <NavLink to="/leaderboard">
                          <DropdownMenuItem className="py-4">
                            Leaderboards
                            <DropdownMenuShortcut>
                              <Award className="size-5" />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </NavLink>

                        <NavLink to="/badges">
                          <DropdownMenuItem className="py-4">
                            Badges
                            <DropdownMenuShortcut>
                              <BadgeCheck className="size-5" />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </NavLink>

                        {twitterUser && (
                          <NavLink to={`/profile/x/${twitterUser.screen_name}`}>
                            <DropdownMenuItem className="py-4">
                              <div className="flex flex-col">
                                <span className="text-sm">My Profile</span>
                                <span className="text-xs text-muted-foreground">
                                  @{twitterUser?.screen_name}
                                </span>
                              </div>
                              <DropdownMenuShortcut>
                                <User className="size-5" />
                              </DropdownMenuShortcut>
                            </DropdownMenuItem>
                          </NavLink>
                        )}

                        {!twitterUser && (
                          <DropdownMenuItem className="py-4 opacity-50 cursor-not-allowed" disabled>
                            <div className="flex flex-col">
                              <span className="text-sm">My Profile</span>
                              <span className="text-xs text-muted-foreground">
                                Connect Twitter first ↓
                              </span>
                            </div>
                            <DropdownMenuShortcut>
                              <User className="size-5" />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        )}

                        {!twitterUser && (
                          <DropdownMenuItem
                            className="py-4 bg-orange-50 border border-orange-200 hover:bg-orange-100 text-orange-800"
                            onClick={() => {
                              setDropdownOpenControl(false);
                              setTimeout(() => {
                                connectXRef.current?.handleConnectTwitterClick();
                              }, 200);
                            }}
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">Connect Twitter</span>
                              <span className="text-xs text-orange-600">
                                Required for profile access
                              </span>
                            </div>
                            <DropdownMenuShortcut>
                              <Twitter className="size-4 text-orange-600" />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem className="py-4" onClick={handleDisconnect}>
                          Disconnect Wallet
                          <DropdownMenuShortcut>
                            <LogOut className="size-5" />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Alternative simple button (commented out for reference)
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
                  */}
                  </>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
      {/* Connect X Drawer */}
      <ConnectTwitter ref={connectXRef} address={address!!} twitterUser={twitterUser} />
    </>
  );
}
