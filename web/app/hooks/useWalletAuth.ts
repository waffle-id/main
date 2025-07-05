import { useState } from "react";
import { useSignMessage } from "wagmi";
import { checkUserAuthenticationStatus } from "~/utils/wallet-auth";
import type { AuthenticationResult } from "~/types/auth";

export function useWalletAuth() {
    const [isLoading, setIsLoading] = useState(false);
    const { signMessageAsync } = useSignMessage();

    const loginWithWallet = async (address: string): Promise<AuthenticationResult> => {
        setIsLoading(true);

        try {
            const authStatus = await checkUserAuthenticationStatus(address);

            if (authStatus.needsTwitterRegistration) {
                return {
                    success: false,
                    error: "Please complete Twitter registration first.",
                    needsTwitterRegistration: true,
                };
            }

            if (!authStatus.canLoginWithWallet) {
                return {
                    success: false,
                    error: "Wallet login not available for this account.",
                };
            }

            const nonceResponse = await fetch(`/api/auth/nonce?address=${encodeURIComponent(address)}`);
            const nonceResult = await nonceResponse.json();

            if (!nonceResult.success || !nonceResult.nonce) {
                return {
                    success: false,
                    error: nonceResult.error || "Failed to get nonce",
                };
            }

            const message = `Sign in to Waffle App\nNonce: ${nonceResult.nonce}`;

            const signature = await signMessageAsync({ message });

            const loginResponse = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ address, signature }),
            });
            const loginResult = await loginResponse.json();

            if (!loginResult.success) {
                return {
                    success: false,
                    error: loginResult.error || "Login failed",
                };
            }

            return {
                success: true,
                user: loginResult.user,
                token: loginResult.token,
            };
        } catch (error) {
            console.error("Wallet login error:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Failed to authenticate with wallet",
            };
        } finally {
            setIsLoading(false);
        }
    };

    const checkAuthStatus = async (address: string) => {
        return await checkUserAuthenticationStatus(address);
    };

    return {
        loginWithWallet,
        checkAuthStatus,
        isLoading,
    };
}
