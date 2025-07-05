import { type ActionFunctionArgs } from "react-router";
import { registerUserWithBackend } from "~/services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
    if (request.method !== "POST") {
        return Response.json({ success: false, error: "Method not allowed" }, { status: 405 });
    }

    try {
        const { twitterId, username, displayName, avatar, address, referralCode } = await request.json();

        if (!twitterId || !username || !displayName || !address) {
            return Response.json({
                success: false,
                error: "Missing required fields: twitterId, username, displayName, address"
            }, { status: 400 });
        }

        const user = {
            id: parseInt(twitterId),
            screen_name: username,
            name: displayName,
            profile_image_url: avatar || "",
            profile_image_url_https: avatar || ""
        };

        const result = await registerUserWithBackend(user, address, referralCode || "");

        return Response.json(result);
    } catch (error) {
        console.error("Error registering user:", error);
        return Response.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
};
