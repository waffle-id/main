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

export async function checkUserExists(address: string): Promise<{
  exists: boolean;
  username?: string;
  address?: string;
  error?: string;
}> {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("Checking if user exists for address:", address);
    }

    const response = await fetch("https://api.waffle.food/account/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("User check failed:", data);
      return {
        exists: false,
        error: data.message || "Failed to check user",
      };
    }

    if (process.env.NODE_ENV === "development") {
      console.log("User check result:", data);
    }
    return {
      exists: data.success,
      username: data.username,
      address: data.address,
    };
  } catch (error) {
    console.error("Error checking user existence:", error);
    return {
      exists: false,
      error: "Network error during user check",
    };
  }
}

export async function getNonce(address: string): Promise<{
  success: boolean;
  nonce?: string;
  error?: string;
}> {
  try {
    console.log("Getting nonce for address:", address);

    const response = await fetch(`https://api.waffle.food/account/nonce/${address}`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to get nonce:", data);
      return {
        success: false,
        error: data.message || "Failed to get nonce",
      };
    }

    console.log("Nonce retrieved successfully");
    return {
      success: true,
      nonce: data.nonce,
    };
  } catch (error) {
    console.error("Error getting nonce:", error);
    return {
      success: false,
      error: "Network error getting nonce",
    };
  }
}

export async function loginUserWithWallet(
  address: string,
  signature: string
): Promise<{
  success: boolean;
  token?: string;
  user?: any;
  error?: string;
}> {
  try {
    console.log("Attempting to login user with wallet signature:", { address });

    const response = await fetch("https://api.waffle.food/account/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address, signature }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Wallet login failed:", data);
      return {
        success: false,
        error: data.message || "Login failed",
      };
    }

    console.log("Wallet login successful:", data);
    return {
      success: true,
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    console.error("Error during wallet login:", error);
    return {
      success: false,
      error: "Network error during login",
    };
  }
}

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

export async function handleUserAuthentication(
  twitterUser: {
    id: number;
    screen_name: string;
    name: string;
    profile_image_url: string;
  },
  address: string,
  referralCode?: string
): Promise<{
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
  requiresTwitterRegistration?: boolean;
}> {
  try {
    const userCheck = await checkUserExists(address);

    if (userCheck.error) {
      return {
        success: false,
        error: userCheck.error,
      };
    }

    if (userCheck.exists && userCheck.username) {
      console.log("User exists, attempting direct login");

      return {
        success: true,
        user: {
          id: twitterUser.id,
          screen_name: twitterUser.screen_name,
          name: twitterUser.name,
          profile_image_url: twitterUser.profile_image_url,
          address: address,
          isRegistered: true,
        },
      };
    }

    if (!referralCode) {
      return {
        success: false,
        error: "Referral code is required for new user registration",
        requiresTwitterRegistration: true,
      };
    }

    console.log("User doesn't exist, proceeding with registration");

    const registrationResult = await registerUserWithBackend(twitterUser, address, referralCode);

    if (!registrationResult.success) {
      return {
        success: false,
        error: registrationResult.error,
        requiresTwitterRegistration: true,
      };
    }

    return {
      success: true,
      token: registrationResult.token,
      user: {
        id: twitterUser.id,
        screen_name: twitterUser.screen_name,
        name: twitterUser.name,
        profile_image_url: twitterUser.profile_image_url,
        address: address,
        isRegistered: true,
      },
    };
  } catch (error) {
    console.error("Error in user authentication flow:", error);
    return {
      success: false,
      error: "Authentication flow failed",
    };
  }
}

authenticator.use(
  new Twitter2Strategy(
    {
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL:
        process.env.NODE_ENV === "production"
          ? "https://waffle.food/auth/twitter/callback"
          : "http://127.0.0.1:5173/auth/twitter/callback",
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

        const authResult = await handleUserAuthentication(
          {
            id: Number(id),
            screen_name: username,
            name: result.data.name,
            profile_image_url: result.data.profile_image_url?.replace("_normal", "") ?? "",
          },
          address,
          referralCode
        );

        if (!authResult.success) {
          throw new Error(authResult.error || "Authentication failed");
        }

        console.log("User authentication successful");

        return authResult.user!;
      } catch (error) {
        console.error("Error in Twitter2Strategy verify function:", error);
        throw error;
      }
    }
  ),
  "twitter"
);
