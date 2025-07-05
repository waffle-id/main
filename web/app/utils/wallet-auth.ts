import type { AuthenticationResult, UserAuthStatus } from "~/types/auth";

export async function performWalletLogin(
    address: string,
    signMessage: (message: string) => Promise<string>
): Promise<AuthenticationResult> {
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

        const signature = await signMessage(message);

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
    }
}

export async function checkUserAuthenticationStatus(address: string): Promise<UserAuthStatus> {
    try {
        console.log("🔍 Checking user auth status for address:", address);
        const response = await fetch(`/api/auth/check-user?address=${encodeURIComponent(address)}`);
        const userCheck = await response.json();

        console.log("📋 Backend user check response:", userCheck);

        if (userCheck.exists && userCheck.username) {
            console.log("✅ User exists with Twitter linked, can login with wallet");
            return {
                canLoginWithWallet: true,
                needsTwitterRegistration: false,
                username: userCheck.username,
                isRegistered: true,
            };
        } else {
            console.log("❌ User doesn't exist or no Twitter linked, needs registration");
            return {
                canLoginWithWallet: false,
                needsTwitterRegistration: true,
                isRegistered: false,
            };
        }
    } catch (error) {
        console.error("Error checking user authentication status:", error);
        return {
            canLoginWithWallet: false,
            needsTwitterRegistration: true,
            isRegistered: false,
        };
    }
}
