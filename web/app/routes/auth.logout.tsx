import { type ActionFunctionArgs, redirect } from "react-router";
import { sessionStorage } from "~/services/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function loader() {
  return redirect("/");
}
