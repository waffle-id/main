import { Authenticator } from "remix-auth";
import { Twitter2Strategy } from "remix-auth-twitter";
import { TwitterApi } from "twitter-api-v2";

export type User = {
    id: number;
    screen_name: string;
    name: string;
    profile_image_url: string;
    email?: string;
    address?: string;
    isRegistered?: boolean;
};

export type PendingRegistration = {
    address: string;
    referralCode: string;
};

export let authenticator = new Authenticator<User>();

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

console.log("Twitter OAuth2 credentials check:");
console.log("ClientID exists:", !!clientID);
console.log("ClientSecret exists:", !!clientSecret);

if (!clientID || !clientSecret) {
    throw new Error("CLIENT_ID and CLIENT_SECRET must be provided");
}

// Function to register user with backend API
export async function registerUserWithBackend(
    user: User,
    address: string,
    referralCode: string
): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
        console.log("Attempting to register user with backend:", {
            username: user.screen_name,
            address,
            referralCode,
            fullName: user.name,
        });

        const response = await fetch("https://api.waffle.food/account/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: user.screen_name,
                address: address,
                referralCode: referralCode,
                fullName: user.name,
                bio: "Hello World!",
                avatarUrl: user.profile_image_url,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Backend registration failed:", data);
            return {
                success: false,
                error: data.message || "Registration failed",
            };
        }

        console.log("Backend registration successful:", data);
        return {
            success: true,
            token: data.token,
        };
    } catch (error) {
        console.error("Error during backend registration:", error);
        return {
            success: false,
            error: "Network error during registration",
        };
    }
}

authenticator.use(
    new Twitter2Strategy(
        {
            clientID: clientID,
            clientSecret: clientSecret,
            callbackURL: "http://127.0.0.1:5173/auth/twitter/callback",
            // callbackURL: "https://waffle.food/auth/twitter/callback",
            scopes: ["users.read", "tweet.read"],
        },
        async ({ request, tokens }) => {
            try {
                const accessToken = tokens.accessToken();
                console.log("Got access token:", !!accessToken);

                const userClient = new TwitterApi(accessToken);
                const result = await userClient.v2.me({
                    "user.fields": ["profile_image_url"],
                });

                console.log("Twitter user data:", result.data);
                const { id, username } = result.data;

                const { sessionStorage } = await import("~/services/session.server");
                const { retrievePendingRegistration, removePendingRegistration } = await import(
                    "~/utils/pending-registration"
                );

                const session = await sessionStorage.getSession(request.headers.get("Cookie"));
                const pendingRegistration = session.get("pendingRegistration");

                const userAgent = request.headers.get("User-Agent") || "unknown";
                const persistentRegistration = retrievePendingRegistration(userAgent);

                console.log("OAuth callback - Cookie header:", request.headers.get("Cookie"));
                console.log("OAuth callback - Session data:", {
                    pendingRegistration,
                    sessionExists: !!session,
                    hasData: !!session.data,
                });
                console.log("OAuth callback - Persistent data:", {
                    persistentRegistration,
                    userAgent: userAgent.substring(0, 50) + "...",
                });

                let address: string | undefined;
                let referralCode: string | undefined;

                if (pendingRegistration?.address && pendingRegistration?.referralCode) {
                    address = pendingRegistration.address;
                    referralCode = pendingRegistration.referralCode;
                    console.log("Using session data for registration");
                } else if (persistentRegistration?.address && persistentRegistration?.referralCode) {
                    address = persistentRegistration.address;
                    referralCode = persistentRegistration.referralCode;
                    console.log("Using persistent data for registration");

                    removePendingRegistration(userAgent);
                }

                if (!address || !referralCode) {
                    console.error("Missing registration data:", {
                        sessionRegistration: pendingRegistration,
                        persistentRegistration,
                        hasAddress: !!address,
                        hasReferralCode: !!referralCode,
                    });
                    throw new Error("Wallet address and referral code are required for registration");
                }

                const registrationResult = await registerUserWithBackend(
                    {
                        id: Number(id),
                        screen_name: username,
                        name: result.data.name,
                        profile_image_url: result.data.profile_image_url?.replace("_normal", "") ?? "",
                    },
                    address,
                    referralCode
                );

                if (!registrationResult.success) {
                    throw new Error(registrationResult.error || "Backend registration failed");
                }

                console.log("Backend registration successful");

                return {
                    id: Number(id),
                    screen_name: username,
                    name: result.data.name,
                    profile_image_url: result.data.profile_image_url?.replace("_normal", "") ?? "",
                    address: address,
                    isRegistered: true,
                };
            } catch (error) {
                console.error("Error in Twitter2Strategy verify function:", error);
                throw error;
            }
        }
    ),
    "twitter"
);
