import { type LoaderFunctionArgs, redirect } from "react-router";
import { authenticator } from "~/services/auth.server";
import { sessionStorage } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const user = await authenticator.authenticate("twitter", request);
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));

    if (user.address && user.referralCode) {
      session.set("pendingRegistration", {
        address: user.address,
        referralCode: user.referralCode,
      });
    } else {
      session.unset("pendingRegistration");
    }

    session.set("user", user);

    const cookie = await sessionStorage.commitSession(session);

    if (user.isRegistered) {
      return redirect("/", {
        headers: {
          "Set-Cookie": cookie,
        },
      });
    } else {
      return redirect("/auth/complete-registration", {
        headers: {
          "Set-Cookie": cookie,
        },
      });
    }
  } catch (error) {
    console.error("Twitter auth callback error:", error);

    try {
      const session = await sessionStorage.getSession(request.headers.get("Cookie"));
      session.unset("pendingRegistration");
      const cookie = await sessionStorage.commitSession(session);

      const errorMessage = (error as any)?.message || "Unknown error";
      return redirect("/?error=auth_failed&details=" + encodeURIComponent(errorMessage), {
        headers: {
          "Set-Cookie": cookie,
        },
      });
    } catch (sessionError) {
      console.error("Session cleanup error:", sessionError);
      const errorMessage = (error as any)?.message || "Unknown error";
      return redirect("/?error=auth_failed&details=" + encodeURIComponent(errorMessage));
    }
  }
}
