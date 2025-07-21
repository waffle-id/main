import { ConnectButton, useConnectModal } from "@xellar/kit";
import { useAccount, useDisconnect, useSwitchChain } from "wagmi";
import { ButtonMagnet } from "../button/magnet-button";
import { FIXED_CHAIN } from "~/constants/wagmi";
import { cn } from "~/utils/cn";
import { useEffect, useState, useRef } from "react";
import {
  ChevronDown,
  LogOut,
  RefreshCcw,
  User,
  Twitter,
  Wallet,
  Calendar,
  Gift,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/shadcn/dropdown-menu";
import { NavLink, Form } from "react-router";
import { ConnectTwitter, type ConnectTwitterRef } from "./shared/connect-twitter";
import { useWaffleProvider } from "../waffle-provider";
import { useWalletAuth } from "~/hooks/useWalletAuth";
import { IconX } from "~/routes/profile/shared/action-score";
import { useDailyLogin } from "~/hooks/useDailyLogin";

export function ConnectWalletXellar({ className }: { className?: string }) {
  const { isConnected, chain, address } = useAccount();
  const { open: openModalXellar } = useConnectModal();
  const { twitterUser, setTwitterUser } = useWaffleProvider();
  const { disconnect } = useDisconnect();
  const { loginWithWallet, checkAuthStatus, isLoading } = useWalletAuth();
  const { switchChain } = useSwitchChain();

  const {
    currentStreak,
    canLoginToday,
    alreadyLoggedToday,
    isSubmitting: isDailyLoginSubmitting,
    performDailyLogin,
    isLoading: isDailyLoginLoading,
  } = useDailyLogin();

  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [authStatus, setAuthStatus] = useState<{
    canLoginWithWallet: boolean;
    needsTwitterRegistration: boolean;
    username?: string;
    isRegistered: boolean;
  } | null>(null);
  const [lastCheckedAddress, setLastCheckedAddress] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const connectXRef = useRef<ConnectTwitterRef>(null);

  const handleDisconnect = async () => {
    try {
      disconnect();

      await fetch("/auth/logout", { method: "POST" });

      localStorage.removeItem("waffle_wallet_address");
      localStorage.removeItem("waffle_referral_code");
      localStorage.removeItem("waffle_auth_token");

      setAuthStatus(null);
      setIsAuthenticated(false);
      setLastCheckedAddress(null);
      setTwitterUser(null);
    } catch (error) {
      disconnect();
      localStorage.removeItem("waffle_wallet_address");
      localStorage.removeItem("waffle_referral_code");
      localStorage.removeItem("waffle_auth_token");

      setAuthStatus(null);
      setIsAuthenticated(false);
      setLastCheckedAddress(null);
      setTwitterUser(null);
    }
  };

  const handleWalletLogin = async () => {
    if (!address) return;

    try {
      const result = await loginWithWallet(address);

      if (result.success) {
        if (result.token) {
          localStorage.setItem("waffle_auth_token", result.token);
        }

        setIsAuthenticated(true);

        if (result.user && (result.user as any).username) {
          const userFromAuth = {
            id: (result.user as any).id || 0,
            screen_name: (result.user as any).username,
            name: (result.user as any).username,
            profile_image_url: "",
            address: (result.user as any).address,
            isRegistered: true,
          };
          setTwitterUser(userFromAuth);
        }

        setTimeout(async () => {
          await refreshAuthStatus();
        }, 100);
      } else if (result.needsTwitterRegistration) {
        connectXRef.current?.handleConnectTwitterClick();
      } else {
      }
    } catch (error) {}
  };

  const handleDailyLogin = async () => {
    if (!canLoginToday || isDailyLoginSubmitting) return;

    try {
      const result = await performDailyLogin();
      if (result.success) {
        console.log("Daily login successful!", result.txHash);
      } else {
        console.error("Daily login failed:", result.error);
      }
    } catch (error) {
      console.error("Daily login error:", error);
    }
  };

  const refreshAuthStatus = async () => {
    if (!address) return;

    setLastCheckedAddress(null);

    const status = await checkAuthStatus(address);

    setAuthStatus(status);

    const existingToken = localStorage.getItem("waffle_auth_token");
    if (status.isRegistered && status.canLoginWithWallet && existingToken) {
      setIsAuthenticated(true);
    } else if (!status.canLoginWithWallet || !existingToken) {
      setIsAuthenticated(false);
    }

    setLastCheckedAddress(address);
  };

  useEffect(() => {
    if (isConnected && address && address !== lastCheckedAddress) {
      if (lastCheckedAddress && address !== lastCheckedAddress) {
        setTwitterUser(null);
        setAuthStatus(null);
        setIsAuthenticated(false);
        localStorage.removeItem("waffle_auth_token");
      }

      localStorage.setItem("waffle_wallet_address", address);

      const existingToken = localStorage.getItem("waffle_auth_token");
      if (existingToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }

      checkAuthStatus(address).then((status) => {
        setAuthStatus(status);

        if (status.isRegistered && status.canLoginWithWallet && existingToken) {
          setIsAuthenticated(true);
        } else if (!status.canLoginWithWallet || !existingToken) {
          setIsAuthenticated(false);
        }
      });
      setLastCheckedAddress(address);
    } else if (!isConnected) {
      localStorage.removeItem("waffle_wallet_address");
      setAuthStatus(null);
      setLastCheckedAddress(null);
      setIsAuthenticated(false);
      setTwitterUser(null);
    }
  }, [isConnected, address, lastCheckedAddress]);

  useEffect(() => {
    const existingToken = localStorage.getItem("waffle_auth_token");
    if (existingToken) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const handleTwitterRegistrationSuccess = () => {
      refreshAuthStatus();
    };

    window.addEventListener("twitterRegistrationSuccess", handleTwitterRegistrationSuccess);

    const handleWindowFocus = () => {
      if (authStatus?.needsTwitterRegistration && address) {
        setTimeout(() => {
          refreshAuthStatus();
        }, 1000);
      }
    };

    window.addEventListener("focus", handleWindowFocus);

    return () => {
      window.removeEventListener("twitterRegistrationSuccess", handleTwitterRegistrationSuccess);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [authStatus?.needsTwitterRegistration, address]);

  useEffect(() => {
    if (twitterUser && authStatus?.needsTwitterRegistration && address) {
      refreshAuthStatus();
    }
  }, [twitterUser, authStatus?.needsTwitterRegistration, address]);

  useEffect(() => {
    if (isConnected && chain) {
      setIsWrongNetwork(chain.id !== FIXED_CHAIN);
    } else if (isConnected && !chain) {
      setIsWrongNetwork(true);
    } else {
      setIsWrongNetwork(false);
    }
  }, [chain, isConnected]);

  return (
    <>
      <ConnectButton.Custom>
        {() => (
          <div>
            {(() => {
              if (!isConnected) {
                return (
                  <ButtonMagnet
                    onClick={openModalXellar}
                    className={className || "w-full sm:w-auto"}
                  >
                    Connect Wallet
                  </ButtonMagnet>
                );
              }

              if (isWrongNetwork) {
                return (
                  <ButtonMagnet
                    className="w-full sm:max-w-xs"
                    onClick={() => switchChain?.({ chainId: FIXED_CHAIN })}
                  >
                    <div className="flex flex-row items-center gap-2">
                      <RefreshCcw className="size-5" />
                      <span className="text-sm">Switch Network</span>
                    </div>
                  </ButtonMagnet>
                );
              }

              if (authStatus?.canLoginWithWallet && !isAuthenticated) {
                return (
                  <ButtonMagnet
                    onClick={handleWalletLogin}
                    className="w-full sm:w-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing..." : "Sign to Login"}
                  </ButtonMagnet>
                );
              }

              return (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div>
                        <ButtonMagnet>
                          <div className="flex flex-row items-center gap-4 text-wrap">
                            {isWrongNetwork ? (
                              "Wrong Network"
                            ) : (
                              <>
                                <div className="flex flex-col items-start">
                                  <span className="text-sm">
                                    {chain?.name
                                      ? `${chain.name} - ${address?.slice(0, 6)}...${address?.slice(
                                          -4
                                        )}`
                                      : `${address?.slice(0, 6)}...${address?.slice(-4)}`}
                                  </span>
                                </div>
                                <ChevronDown className="size-4 transition-transform" />
                              </>
                            )}
                          </div>
                        </ButtonMagnet>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-48 z-[100002]">
                      {isWrongNetwork && (
                        <DropdownMenuItem
                          className="py-4 cursor-pointer"
                          onClick={() => switchChain?.({ chainId: FIXED_CHAIN })}
                        >
                          Change Network
                          <DropdownMenuShortcut>
                            <RefreshCcw className="size-5" />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                      )}

                      {authStatus?.canLoginWithWallet && !isAuthenticated && (
                        <DropdownMenuItem
                          className="py-4 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-800 cursor-pointer"
                          onClick={handleWalletLogin}
                          disabled={isLoading}
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {isLoading ? "Signing..." : "Sign to Login"}
                            </span>
                            <span className="text-xs text-blue-600">
                              Quick access with wallet signature
                            </span>
                          </div>
                          <DropdownMenuShortcut>
                            <User className="size-4 text-blue-600" />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                      )}

                      {/* <NavLink to="/">
                        <DropdownMenuItem className="py-4 cursor-pointer">
                          Home
                          <DropdownMenuShortcut>
                            <House className="size-5" />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </NavLink> */}

                      {isAuthenticated && !isDailyLoginLoading && (
                        <DropdownMenuItem
                          className={cn(
                            "py-4 cursor-pointer transition-all duration-300",
                            canLoginToday
                              ? "text-orange-800"
                              : alreadyLoggedToday
                              ? "text-green-800"
                              : "opacity-50 cursor-not-allowed"
                          )}
                          onClick={handleDailyLogin}
                          disabled={!canLoginToday || isDailyLoginSubmitting}
                        >
                          <div className="flex flex-col flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {isDailyLoginSubmitting
                                  ? "Checking in..."
                                  : canLoginToday
                                  ? "Daily Check-in"
                                  : alreadyLoggedToday
                                  ? "Checked in today!"
                                  : "Daily Check-in"}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {canLoginToday
                                ? "Claim your daily reward"
                                : alreadyLoggedToday
                                ? `Streak: ${currentStreak} day${currentStreak !== 1 ? "s" : ""}`
                                : "Come back tomorrow"}
                            </span>
                          </div>
                          <DropdownMenuShortcut>
                            {isDailyLoginSubmitting ? (
                              <div className="animate-spin h-4 w-4 border-2 border-orange-600 border-t-transparent rounded-full"></div>
                            ) : canLoginToday ? (
                              <Gift className="size-4 text-orange-600" />
                            ) : alreadyLoggedToday ? (
                              <Calendar className="size-4 text-green-600" />
                            ) : (
                              <Calendar className="size-4 text-gray-400" />
                            )}
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                      )}

                      {twitterUser ? (
                        <NavLink to={`/profile/x/${twitterUser.screen_name}`}>
                          <DropdownMenuItem className="py-4 cursor-pointer flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">My Profile</span>
                            </div>
                            <IconX className="size-4" />
                          </DropdownMenuItem>
                        </NavLink>
                      ) : authStatus?.username ? (
                        <NavLink to={`/profile/x/${authStatus.username}`}>
                          <DropdownMenuItem className="py-4 cursor-pointer flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">My Profile</span>
                            </div>
                            <IconX className="size-4" />
                          </DropdownMenuItem>
                        </NavLink>
                      ) : address ? (
                        <NavLink to={`/profile/w/${address}`}>
                          <DropdownMenuItem className="py-4 cursor-pointer flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">My Profile</span>
                              <span className="text-xs text-muted-foreground">
                                {`${address.slice(0, 6)}...${address.slice(-4)}`}
                              </span>
                            </div>
                            <Wallet className="size-4" />
                          </DropdownMenuItem>
                        </NavLink>
                      ) : null}

                      {authStatus?.needsTwitterRegistration && (
                        <DropdownMenuItem
                          className="py-4 text-red-800 cursor-pointer"
                          onClick={() => {
                            connectXRef.current?.handleConnectTwitterClick();
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">⚠️ Connect Twitter</span>
                            <span className="text-xs text-red-600">
                              Required for wallet registration
                            </span>
                          </div>
                          <DropdownMenuShortcut>
                            <Twitter className="size-4 text-red-600" />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                      )}

                      {!authStatus?.needsTwitterRegistration &&
                        !authStatus?.username &&
                        !twitterUser && (
                          <DropdownMenuItem className="py-4 opacity-50 cursor-not-allowed" disabled>
                            <div className="flex flex-col">
                              <span className="text-sm">My Profile</span>
                              <span className="text-xs text-muted-foreground">
                                No profile data available
                              </span>
                            </div>
                            <DropdownMenuShortcut>
                              <User className="size-5" />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        )}

                      {twitterUser && process.env.NODE_ENV !== "production" && (
                        <Form action="/auth/logout" method="post">
                          <DropdownMenuItem className="py-4 cursor-pointer" asChild>
                            <button type="submit" className="w-full text-left">
                              [DEV] Logout Twitter
                              <DropdownMenuShortcut>
                                <LogOut className="size-4" />
                              </DropdownMenuShortcut>
                            </button>
                          </DropdownMenuItem>
                        </Form>
                      )}

                      <DropdownMenuItem className="py-4 cursor-pointer" onClick={handleDisconnect}>
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

      <ConnectTwitter ref={connectXRef} address={address!!} twitterUser={twitterUser} />
    </>
  );
}
