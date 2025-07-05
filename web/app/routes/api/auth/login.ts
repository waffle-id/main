import { type ActionFunctionArgs } from "react-router";
import { loginUserWithWallet } from "~/services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
    if (request.method !== "POST") {
        return Response.json({ success: false, error: "Method not allowed" }, { status: 405 });
    }

    try {
        const { address, signature } = await request.json();

        if (!address || !signature) {
            return Response.json({
                success: false,
                error: "Address and signature are required"
            }, { status: 400 });
        }

        const result = await loginUserWithWallet(address, signature);
        return Response.json(result);
    } catch (error) {
        console.error("Error logging in with wallet:", error);
        return Response.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
};
