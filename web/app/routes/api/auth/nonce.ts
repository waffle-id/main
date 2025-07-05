import { type LoaderFunctionArgs } from "react-router";
import { getNonce } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const address = url.searchParams.get("address");

    if (!address) {
        return Response.json({ success: false, error: "Address parameter is required" }, { status: 400 });
    }

    try {
        const result = await getNonce(address);
        return Response.json(result);
    } catch (error) {
        console.error("Error getting nonce:", error);
        return Response.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
};
