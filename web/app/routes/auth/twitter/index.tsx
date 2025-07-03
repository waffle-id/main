import { type ActionFunctionArgs, type LoaderFunctionArgs, redirect } from "react-router";
import { authenticator } from "~/services/auth.server";
import { sessionStorage } from "~/services/session.server";
import { debugSession } from "~/utils/debug-session";
import { storePendingRegistration } from "~/utils/pending-registration";

async function handleTwitterAuth(request: Request) {
  try {
    const url = new URL(request.url);
    const address = url.searchParams.get("address");
    const referralCode = url.searchParams.get("referralCode");
    const userAgent = request.headers.get("User-Agent") || "unknown";

    console.log("Twitter auth request:", {
      address,
      referralCode,
      url: request.url,
      method: request.method,
      isDataRequest: request.url.includes(".data"),
    });

    if (address && referralCode) {
      const session = await sessionStorage.getSession(request.headers.get("Cookie"));
      session.set("pendingRegistration", { address, referralCode });

      const key = storePendingRegistration(address, referralCode, userAgent);

      console.log("Stored pending registration in both session and persistent storage:", {
        address,
        referralCode,
        key,
      });

      await debugSession(request, "After storing registration");

      const headers = new Headers();
      headers.set("Set-Cookie", await sessionStorage.commitSession(session));

      throw redirect("/auth/twitter", { headers });
    }

    await debugSession(request, "Before OAuth flow");
    return await authenticator.authenticate("twitter", request);
  } catch (error) {
    console.error("Error in Twitter auth:", error);

    if (error instanceof Response) {
      throw error;
    }
    throw error;
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  return handleTwitterAuth(request);
}

export async function action({ request }: ActionFunctionArgs) {
  return handleTwitterAuth(request);
}
