import { ConnectButton, useConnectModal } from "@xellar/kit";
import { useAccount, useDisconnect } from "wagmi";
import { ButtonMagnet } from "../button/magnet-button";
import { FIXED_CHAIN } from "~/constants/wagmi";
import { useEffect, useState } from "react";
import { ChevronDown, Hash, House, LogOut, RefreshCcw, User, Twitter, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/shadcn/dropdown-menu";
import { Button } from "~/components/shadcn/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "~/components/shadcn/drawer";
import { Input } from "~/components/shadcn/input";
import { NavLink, Form } from "react-router";
import { useOptionalUser } from "~/utils/auth";

export function ConnectWalletXellar() {
  const { isConnected, chain, address } = useAccount();
  const { open: openModalXellar } = useConnectModal();
  const twitterUser = useOptionalUser();
  const { disconnect } = useDisconnect();

  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [isInvitationDrawerOpen, setIsInvitationDrawerOpen] = useState(false);
  const [invitationCode, setInvitationCode] = useState("");
  const [hasValidInvitation, setHasValidInvitation] = useState(false);
  const [invitationError, setInvitationError] = useState("");
  const [validatedInvitationCode, setValidatedInvitationCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const validateReferralCode = async (code: string) => {
    try {
      const response = await fetch(
        `https://api.waffle.food/referral-codes/${encodeURIComponent(code)}`
      );
      const data = await response.json();

      if (response.ok && data._id && !data.isExpired) {
        return { isValid: true, data };
      } else {
        return {
          isValid: false,
          error: data.message || "Invalid or expired referral code",
        };
      }
    } catch (error) {
      console.error("Error validating referral code:", error);
      return {
        isValid: false,
        error: "Failed to validate referral code. Please try again.",
      };
    }
  };

  const handleInvitationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = invitationCode.trim();

    if (!code) {
      setInvitationError("Please enter a referral code");
      return;
    }

    setIsValidating(true);
    setInvitationError("");

    const result = await validateReferralCode(code);

    setIsValidating(false);

    if (result.isValid) {
      setHasValidInvitation(true);
      setInvitationError("");
      setValidatedInvitationCode(code);
      setInvitationCode("");
      localStorage.setItem("waffle_referral_code", code);
      console.log("Valid referral code:", result.data);
    } else {
      setInvitationError(result.error || "Invalid referral code. Please try again.");
    }
  };

  const handleConnectTwitterClick = () => {
    if (!hasValidInvitation) {
      setIsInvitationDrawerOpen(true);
    }
  };

  const handleDrawerClose = () => {
    setIsInvitationDrawerOpen(false);
    setInvitationCode("");
    setInvitationError("");
  };

  const handleDisconnect = () => {
    disconnect();

    localStorage.removeItem("waffle_wallet_address");
    localStorage.removeItem("waffle_referral_code");
    setHasValidInvitation(false);
    setValidatedInvitationCode("");
  };

  useEffect(() => {
    if (isConnected && address) {
      localStorage.setItem("waffle_wallet_address", address);
    } else {
      localStorage.removeItem("waffle_wallet_address");
    }
  }, [isConnected, address]);

  useEffect(() => {
    const storedReferralCode = localStorage.getItem("waffle_referral_code");
    if (storedReferralCode) {
      // Validate stored referral code on mount
      validateReferralCode(storedReferralCode)
        .then((result) => {
          if (result.isValid) {
            setHasValidInvitation(true);
            setValidatedInvitationCode(storedReferralCode);
            console.log("Stored referral code is valid:", result.data);
          } else {
            // Remove invalid stored code
            localStorage.removeItem("waffle_referral_code");
            setHasValidInvitation(false);
            setValidatedInvitationCode("");
            console.log("Stored referral code is invalid, removed from storage");
          }
        })
        .catch((error) => {
          console.error("Error validating stored referral code:", error);
          // Keep the stored code but don't mark as valid
          setValidatedInvitationCode(storedReferralCode);
        });
    }
  }, []);

  const getTwitterAuthUrl = () => {
    const storedAddress = localStorage.getItem("waffle_wallet_address") || address || "";
    const storedReferralCode =
      localStorage.getItem("waffle_referral_code") || validatedInvitationCode;
    return `/auth/twitter?address=${encodeURIComponent(
      storedAddress
    )}&referralCode=${encodeURIComponent(storedReferralCode)}`;
  };

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
                  <DropdownMenuContent align="center" className="w-48">
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

                    {twitterUser ? (
                      <DropdownMenuItem className="py-4" disabled>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{twitterUser.name}</span>
                          <span className="text-xs text-muted-foreground">
                            @{twitterUser.screen_name}
                          </span>
                        </div>
                        <DropdownMenuShortcut>
                          <Twitter className="size-4" />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    ) : !hasValidInvitation ? (
                      <DropdownMenuItem className="py-4" onClick={handleConnectTwitterClick}>
                        Connect Twitter
                        <DropdownMenuShortcut>
                          <Twitter className="size-4" />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    ) : null}
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

                    <NavLink to={`/profile/w/${address}`}>
                      <DropdownMenuItem className="py-4">
                        My Profile
                        <DropdownMenuShortcut>
                          <User className="size-5" />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </NavLink>

                    <DropdownMenuItem className="py-4" onClick={handleDisconnect}>
                      Disconnect Wallet
                      <DropdownMenuShortcut>
                        <LogOut className="size-5" />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Drawer open={isInvitationDrawerOpen} onOpenChange={handleDrawerClose}>
                  <DrawerContent className="min-h-[50vh] max-h-[80vh]">
                    <div className="flex flex-col h-full">
                      <DrawerHeader className="text-center flex-shrink-0">
                        <DrawerTitle className="text-xl font-semibold">
                          {hasValidInvitation ? "Connect Your Twitter" : "Invitation Required"}
                        </DrawerTitle>
                        <DrawerDescription className="text-base mt-2">
                          {hasValidInvitation
                            ? "Great! Now you can connect your Twitter account to access full features. Registration will complete automatically."
                            : "You need a valid invitation code to access full features and connect your Twitter account."}
                        </DrawerDescription>
                      </DrawerHeader>

                      <div className="flex-1 flex items-center justify-center px-6 py-8">
                        <div className="w-full max-w-sm">
                          {!hasValidInvitation ? (
                            <form onSubmit={handleInvitationSubmit} className="space-y-6">
                              <div className="space-y-3">
                                <label
                                  htmlFor="invitation-code"
                                  className="text-sm font-medium block"
                                >
                                  Invitation Code
                                </label>
                                <Input
                                  id="invitation-code"
                                  type="text"
                                  placeholder="Enter your invitation code"
                                  value={invitationCode}
                                  onChange={(e) => {
                                    setInvitationCode(e.target.value);
                                    setInvitationError("");
                                  }}
                                  className={`h-12 text-center text-lg ${
                                    invitationError ? "border-red-500" : ""
                                  }`}
                                  disabled={isValidating}
                                  autoFocus
                                />
                                {invitationError && (
                                  <p className="text-sm text-red-500 text-center">
                                    {invitationError}
                                  </p>
                                )}
                              </div>

                              <div className="flex gap-3 pt-4">
                                <ButtonMagnet
                                  type="submit"
                                  className="flex-1 h-12"
                                  disabled={isValidating}
                                >
                                  {isValidating ? "Verifying..." : "Verify Code"}
                                </ButtonMagnet>
                                <DrawerClose>
                                  <ButtonMagnet
                                    type="button"
                                    className="h-12 px-4"
                                    disabled={isValidating}
                                  >
                                    <X className="size-5" />
                                  </ButtonMagnet>
                                </DrawerClose>
                              </div>
                            </form>
                          ) : (
                            <div className="space-y-6 text-center">
                              <div className="text-green-600 text-lg font-medium">
                                ✓ Invitation Code Verified!
                              </div>{" "}
                              {!twitterUser ? (
                                <div className="flex gap-3">
                                  <NavLink to={getTwitterAuthUrl()} className="flex-1">
                                    <ButtonMagnet className="w-full h-12">
                                      <div className="flex items-center justify-center gap-2">
                                        <Twitter className="size-5" />
                                        <span>Connect Twitter</span>
                                      </div>
                                    </ButtonMagnet>
                                  </NavLink>
                                  <DrawerClose>
                                    <ButtonMagnet type="button" className="h-12 px-4">
                                      <X className="size-5" />
                                    </ButtonMagnet>
                                  </DrawerClose>
                                </div>
                              ) : (
                                <div className="space-y-4 text-center">
                                  <div className="text-sm text-muted-foreground">
                                    Twitter connected! Registration completed automatically.
                                  </div>
                                  <DrawerClose>
                                    <ButtonMagnet className="w-full h-12">Continue</ButtonMagnet>
                                  </DrawerClose>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0 px-6 pb-6 text-center">
                        <p className="text-xs text-muted-foreground">
                          {!hasValidInvitation
                            ? "Need an invitation code? Contact support for access."
                            : "Registration will complete automatically when you connect Twitter."}
                        </p>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>

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
  );
}
