import { type ActionFunctionArgs } from "react-router";
import { registerUserWithBackend } from "~/services/auth.server";
import { sessionStorage } from "~/services/session.server";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json({ success: false, error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { address, txHash, twitterUser, referralCode } = await request.json();

    if (!address || !txHash || !twitterUser) {
      return Response.json(
        {
          success: false,
          error: "Missing required fields: address, txHash, and twitterUser are required",
        },
        { status: 400 }
      );
    }

    if (!referralCode || referralCode === "DEFAULT_CODE") {
      return Response.json(
        {
          success: false,
          error: "Valid referral code is required for registration",
        },
        { status: 400 }
      );
    }

    console.log("Completing registration with backend:", {
      address,
      txHash,
      username: twitterUser.screen_name,
      referralCode: referralCode,
    });

    const result = await registerUserWithBackend(
      {
        id: twitterUser.id || 0,
        screen_name: twitterUser.screen_name,
        name: twitterUser.name,
        profile_image_url: twitterUser.profile_image_url,
      },
      address,
      referralCode
    );

    if (!result.success) {
      return Response.json(
        {
          success: false,
          error: result.error || "Backend registration failed",
        },
        { status: 400 }
      );
    }

    try {
      const session = await sessionStorage.getSession(request.headers.get("Cookie"));
      const currentUser = session.get("user");

      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          isRegistered: true,
          address: address,
        };
        session.set("user", updatedUser);

        const cookie = await sessionStorage.commitSession(session);

        return Response.json(
          {
            success: true,
            message: "Registration completed successfully",
            token: result.token,
          },
          {
            headers: {
              "Set-Cookie": cookie,
            },
          }
        );
      }
    } catch (sessionError) {
      console.error("Failed to update session:", sessionError);
    }

    return Response.json({
      success: true,
      message: "Registration completed successfully",
      token: result.token,
    });
  } catch (error) {
    console.error("Registration completion API error:", error);
    return Response.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
