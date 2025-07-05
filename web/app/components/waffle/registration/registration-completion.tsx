import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useContractRegistration } from "~/hooks/useContractRegistration";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

type RegistrationCompletionProps = {
  twitterUser: {
    name: string;
    screen_name: string;
    profile_image_url: string;
  };
  registrationData?: {
    address: string;
    referralCode: string;
  };
  onComplete?: () => void;
};

export function RegistrationCompletion({
  twitterUser,
  registrationData,
  onComplete,
}: RegistrationCompletionProps) {
  const { address, isConnected } = useAccount();
  const {
    registerUser,
    isRegistering,
    registrationError,
    txHash,
    isConfirming,
    isConfirmed,
    isWritePending,
  } = useContractRegistration();
  const [step, setStep] = useState<"wallet" | "contract" | "backend" | "complete">("wallet");
  const [backendError, setBackendError] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string>("");
  const [isSubmittingBackend, setIsSubmittingBackend] = useState(false);
  const [contractSuccess, setContractSuccess] = useState(false);
  const [completedTxHash, setCompletedTxHash] = useState<string | null>(null);

  useEffect(() => {
    const finalReferralCode =
      registrationData?.referralCode ||
      (typeof window !== "undefined" ? localStorage.getItem("waffle_referral_code") : null) ||
      "";
    setReferralCode(finalReferralCode);

    console.log("RegistrationCompletion mounted with data:", {
      twitterUser: twitterUser.screen_name,
      registrationData,
      referralCodeFromRegistration: registrationData?.referralCode,
      referralCodeFromLocalStorage:
        typeof window !== "undefined" ? localStorage.getItem("waffle_referral_code") : null,
      finalReferralCode,
    });
  }, [registrationData]);

  useEffect(() => {
    if (!referralCode && typeof window !== "undefined") {
      const storageCode = localStorage.getItem("waffle_referral_code");
      if (storageCode) {
        console.log("Found referral code in localStorage as fallback:", storageCode);
        setReferralCode(storageCode);
      }
    }
  }, [referralCode]);

  useEffect(() => {
    console.log("useEffect triggered:", { isConfirmed, txHash: !!txHash, step, contractSuccess });

    if (isConfirmed && txHash && step === "contract" && !contractSuccess) {
      console.log("✅ Transaction confirmed, proceeding to backend registration...");
      setContractSuccess(true);
      setCompletedTxHash(txHash);

      handleBackendRegistration(txHash);
    }
  }, [isConfirmed, txHash, step, contractSuccess]);

  const handleCompleteRegistration = async () => {
    if (!address || !isConnected) {
      console.log("Wallet not connected, setting step to wallet");
      setStep("wallet");
      return;
    }

    if (isRegistering || isSubmittingBackend) {
      console.log("Registration already in progress, skipping");
      return;
    }

    if (contractSuccess && completedTxHash) {
      console.log("Contract already completed, proceeding to backend");
      await handleBackendRegistration();
      return;
    }

    console.log("=== Starting contract registration ===");
    console.log("Address:", address);
    console.log("Twitter user:", twitterUser.screen_name);
    console.log("Referral code:", referralCode);

    try {
      setStep("contract");
      console.log("Starting contract registration...");

      const contractResult = await registerUser();

      if (!contractResult.success) {
        console.error("Contract registration failed:", contractResult.error);
        return;
      }

      console.log("Contract registration successful, tx:", contractResult.txHash);
    } catch (error) {
      console.error("Registration completion error:", error);
      setBackendError(error instanceof Error ? error.message : "Unknown error");
    }
  };

  const handleBackendRegistration = async (txHashToUse?: string) => {
    const finalTxHash = txHashToUse || completedTxHash;
    if (!address || !finalTxHash) {
      console.error("Missing address or txHash for backend registration");
      return;
    }

    let finalReferralCode =
      registrationData?.referralCode ||
      referralCode ||
      (typeof window !== "undefined" ? localStorage.getItem("waffle_referral_code") : null);

    console.log("Referral code resolution:", {
      fromRegistrationData: registrationData?.referralCode,
      fromState: referralCode,
      fromLocalStorage:
        typeof window !== "undefined" ? localStorage.getItem("waffle_referral_code") : null,
      final: finalReferralCode,
    });

    if (!finalReferralCode) {
      console.error("No referral code available for registration");
      setBackendError("Referral code is required for registration. Please refresh and try again.");
      return;
    }

    console.log("Starting backend registration with:", {
      address,
      txHash: finalTxHash,
      referralCode: finalReferralCode,
      username: twitterUser.screen_name,
    });

    setStep("backend");
    setIsSubmittingBackend(true);
    setBackendError(null);

    try {
      const backendResponse = await fetch("/api/account/complete-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          txHash: finalTxHash,
          twitterUser,
          referralCode: finalReferralCode,
        }),
      });

      const backendResult = await backendResponse.json();

      if (!backendResult.success) {
        setBackendError(backendResult.error || "Backend registration failed");
        return;
      }

      console.log("Backend registration successful", { token: !!backendResult.token });

      if (backendResult.token) {
        localStorage.setItem("waffle_auth_token", backendResult.token);
        console.log("Stored authentication token for automatic login");
      }

      setStep("complete");

      setTimeout(() => {
        console.log("Registration complete, triggering page refresh to update session");
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      console.error("Backend registration error:", error);
      setBackendError(error instanceof Error ? error.message : "Backend registration failed");
    } finally {
      setIsSubmittingBackend(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case "wallet":
        return (
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Connect Your Wallet</h3>
            <p className="text-muted-foreground">
              Please connect your wallet to complete the registration process.
            </p>

            {(registrationData?.referralCode || referralCode) && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-700">
                  Using referral code:{" "}
                  <span className="font-mono">
                    {registrationData?.referralCode || referralCode}
                  </span>
                </p>
              </div>
            )}

            {!isConnected && (
              <p className="text-sm text-orange-600">
                Your wallet needs to be connected to proceed.
              </p>
            )}
          </div>
        );

      case "contract":
        return (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>

            {isWritePending && !txHash && (
              <>
                <h3 className="text-lg font-semibold">Preparing Transaction</h3>
                <p className="text-muted-foreground">
                  Please confirm the transaction in your wallet to register on the Waffle smart
                  contract.
                </p>
              </>
            )}

            {txHash && isConfirming && (
              <>
                <h3 className="text-lg font-semibold">Waiting for Confirmation</h3>
                <p className="text-muted-foreground">
                  Transaction submitted! Waiting for blockchain confirmation...
                </p>
                <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                  <span>This may take a few minutes</span>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  Transaction: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </p>
              </>
            )}

            {txHash && isConfirmed && (
              <>
                <h3 className="text-lg font-semibold text-green-600">Transaction Confirmed!</h3>
                <p className="text-muted-foreground">
                  Successfully registered on blockchain. Starting backend registration...
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  Transaction: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </p>
              </>
            )}

            {!isWritePending && !txHash && (
              <>
                <h3 className="text-lg font-semibold">Registering on Blockchain</h3>
                <p className="text-muted-foreground">Initiating smart contract registration...</p>
              </>
            )}
          </div>
        );

      case "backend":
        return (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">Finalizing Registration</h3>
            <p className="text-muted-foreground">
              Completing your account setup on Waffle servers...
            </p>
          </div>
        );

      case "complete":
        return (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-600">Registration Complete!</h3>
            <p className="text-muted-foreground">
              Welcome to Waffle, @{twitterUser.screen_name}! Your account is now fully set up.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const showError = registrationError || backendError;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={twitterUser.profile_image_url}
          alt={twitterUser.name}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold">{twitterUser.name}</h2>
          <p className="text-muted-foreground">@{twitterUser.screen_name}</p>
        </div>
      </div>

      {renderStepContent()}

      {showError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-sm text-red-700">{showError}</p>
          </div>
          {/* Debug info for referral code issues */}
          {showError.includes("Referral code") && (
            <div className="mt-2 text-xs text-red-600 space-y-1">
              <p>Debug info:</p>
              <p>• Registration data: {registrationData?.referralCode || "none"}</p>
              <p>• Component state: {referralCode || "none"}</p>
              <p>
                • localStorage:{" "}
                {typeof window !== "undefined"
                  ? localStorage.getItem("waffle_referral_code") || "none"
                  : "n/a"}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {step === "wallet" && isConnected && (
          <ButtonMagnet
            onClick={handleCompleteRegistration}
            className="w-full"
            disabled={isRegistering || isSubmittingBackend}
          >
            Complete Registration
          </ButtonMagnet>
        )}

        {step === "contract" && registrationError && (
          <ButtonMagnet onClick={handleCompleteRegistration} className="w-full" color="orange">
            Retry Contract Registration
          </ButtonMagnet>
        )}

        {step === "backend" && backendError && (
          <ButtonMagnet
            onClick={() => handleBackendRegistration()}
            className="w-full"
            color="orange"
          >
            Retry Backend Registration
          </ButtonMagnet>
        )}
      </div>

      {/* Step indicator */}
      <div className="mt-6 flex justify-center space-x-2">
        {["wallet", "contract", "backend", "complete"].map((stepName, index) => (
          <div
            key={stepName}
            className={`w-2 h-2 rounded-full ${
              step === stepName
                ? "bg-blue-600"
                : ["wallet", "contract", "backend", "complete"].indexOf(step) > index
                ? "bg-green-600"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
