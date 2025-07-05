import { ConnectButton, useConnectModal } from "@xellar/kit";
import { useAccount, useDisconnect } from "wagmi";
import { ButtonMagnet } from "../button/magnet-button";
import { FIXED_CHAIN } from "~/constants/wagmi";
import { useEffect, useState, useRef } from "react";
import {
  ChevronDown,
  Hash,
  House,
  LogOut,
  RefreshCcw,
  User,
  Twitter,
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
import { NavLink, Form } from "react-router";
import { ConnectTwitter, type ConnectTwitterRef } from "./shared/connect-twitter";
import { useWaffleProvider } from "../waffle-provider";

export function ConnectWalletXellar() {
  const { isConnected, chain, address } = useAccount();
  const { open: openModalXellar } = useConnectModal();
  const { twitterUser } = useWaffleProvider();
  const { disconnect } = useDisconnect();

  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const connectXRef = useRef<ConnectTwitterRef>(null);

  const handleDisconnect = () => {
    disconnect();

    localStorage.removeItem("waffle_wallet_address");
    localStorage.removeItem("waffle_referral_code");
  };

  useEffect(() => {
    if (isConnected && address) {
      localStorage.setItem("waffle_wallet_address", address);
    } else {
      localStorage.removeItem("waffle_wallet_address");
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (isConnected && chain?.id !== FIXED_CHAIN) {
      setIsWrongNetwork(true);
    } else {
      setIsWrongNetwork(false);
    }
  }, [chain]);

  return (
    <>
      <ConnectButton.Custom>
        {() => (
          <div>
            {(() => {
              if (!isConnected) {
                return (
                  <ButtonMagnet onClick={openModalXellar} className="w-full sm:w-auto">
                    Connect Wallet
                  </ButtonMagnet>
                );
              }

              if (isWrongNetwork) {
                return (
                  <ButtonMagnet className="w-full sm:max-w-xs">
                    <div className="flex flex-row items-center gap-2">
                      <RefreshCcw className="size-5" />
                      <span className="text-sm">Switch Network</span>
                    </div>
                  </ButtonMagnet>
                );
              }

              return (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div>
                        <ButtonMagnet>
                          <div className="flex flex-row items-center gap-4">
                            {isWrongNetwork ? (
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
                    <DropdownMenuContent align="center" className="w-48 z-[100002]">
                      {isWrongNetwork && (
                        <DropdownMenuItem className="py-4">
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
                            connectXRef.current?.handleConnectTwitterClick();
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

                      {twitterUser && (
                        <Form action="/auth/logout" method="post">
                          <DropdownMenuItem className="py-4" asChild>
                            <button type="submit" className="w-full text-left">
                              [DEV] Logout Twitter
                              <DropdownMenuShortcut>
                                <LogOut className="size-4" />
                              </DropdownMenuShortcut>
                            </button>
                          </DropdownMenuItem>
                        </Form>
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
                  <ButtonMagnet className="w-full sm:max-w-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
                      <span className="text-sm truncate">
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
        )}
      </ConnectButton.Custom>

      {/* Connect Twitter Drawer */}
      <ConnectTwitter ref={connectXRef} address={address!!} twitterUser={twitterUser} />
    </>
  );
}
