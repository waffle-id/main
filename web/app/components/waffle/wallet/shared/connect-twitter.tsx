import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
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
import { ButtonMagnet } from "../../button/magnet-button";
import { NavLink } from "react-router";
import { Twitter, X } from "lucide-react";
import type { Address } from "viem";

export type ConnectTwitterRef = {
  handleConnectTwitterClick: () => void;
};

type ConnectTwitterProps = {
  address: Address;
  twitterUser: {
    name: string;
    screen_name: string;
  } | null;
};

// export function ConnectTwitterFn() {
export const ConnectTwitter = forwardRef<ConnectTwitterRef, ConnectTwitterProps>(
  ({ address, twitterUser }, ref) => {
    const [isInvitationDrawerOpen, setIsInvitationDrawerOpen] = useState(false);
    const [invitationCode, setInvitationCode] = useState("");
    const [hasValidInvitation, setHasValidInvitation] = useState(false);
    const [invitationError, setInvitationError] = useState("");
    const [validatedInvitationCode, setValidatedInvitationCode] = useState("");
    const [isValidating, setIsValidating] = useState(false);

    async function validateReferralCode(code: string) {
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
    }

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

    function handleDrawerClose() {
      setIsInvitationDrawerOpen(false);
      setInvitationCode("");
      setInvitationError("");
    }

    function getTwitterAuthUrl() {
      const storedAddress = localStorage.getItem("waffle_wallet_address") || address || "";
      const storedReferralCode =
        localStorage.getItem("waffle_referral_code") || validatedInvitationCode;
      return `/auth/twitter?address=${encodeURIComponent(
        storedAddress
      )}&referralCode=${encodeURIComponent(storedReferralCode)}`;
    }

    useImperativeHandle(ref, () => ({
      handleConnectTwitterClick: () => {
        if (!hasValidInvitation) {
          setIsInvitationDrawerOpen(true);
        }
      },
    }));

    useEffect(() => {
      const storedReferralCode = localStorage.getItem("waffle_referral_code");
      if (storedReferralCode) {
        validateReferralCode(storedReferralCode)
          .then((result) => {
            if (result.isValid) {
              setHasValidInvitation(true);
              setValidatedInvitationCode(storedReferralCode);
              console.log("Stored referral code is valid:", result.data);
            } else {
              localStorage.removeItem("waffle_referral_code");
              setHasValidInvitation(false);
              setValidatedInvitationCode("");
              console.log("Stored referral code is invalid, removed from storage");
            }
          })
          .catch((error) => {
            console.error("Error validating stored referral code:", error);
            setValidatedInvitationCode(storedReferralCode);
          });
      }
    }, []);

    return (
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
                      <label htmlFor="invitation-code" className="text-sm font-medium block">
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
                        className={`bg-transparent focus-visible:ring-0 placeholder:text-black/50 border-black/50 focus-visible:border-black md:text-lg h-max ${
                          invitationError ? "border-red-500" : ""
                        }`}
                        autoFocus
                      />
                      {invitationError && (
                        <p className="text-sm text-red-500 text-center">{invitationError}</p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <ButtonMagnet
                        type="submit"
                        className="flex-1 h-12"
                        disabled={isValidating || !invitationCode.trim()}
                      >
                        {isValidating ? "Validating..." : "Verify Code"}
                      </ButtonMagnet>
                      <DrawerClose>
                        <ButtonMagnet color="red" className="h-12 px-4">
                          <X className="size-5" />
                        </ButtonMagnet>
                      </DrawerClose>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6 text-center">
                    <div className="text-green-600 text-lg font-medium">
                      ✓ Invitation Code Verified!
                    </div>

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
    );
  }
);
