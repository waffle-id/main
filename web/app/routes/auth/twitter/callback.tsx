import { type LoaderFunctionArgs, redirect } from "react-router";
import { authenticator } from "~/services/auth.server";
import { sessionStorage } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const user = await authenticator.authenticate("twitter", request);
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));

    session.set("user", user);

    const cookie = await sessionStorage.commitSession(session);

    return redirect("/", {
      headers: {
        "Set-Cookie": cookie,
      },
    });
  } catch (error) {
    const errorMessage = (error as any)?.message || "Unknown error";
    return redirect("/?error=auth_failed&details=" + encodeURIComponent(errorMessage));
  }
}
