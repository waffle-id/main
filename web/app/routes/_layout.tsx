import { type LoaderFunctionArgs } from "react-router";
import { Outlet } from "react-router";
import { Header } from "~/components/layouts/header";
import { Footer } from "~/components/layouts/footer";
import { sessionStorage } from "~/services/session.server";
import type { User } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const user = session.get("user") as User | null;

  return { user };
}

export default function DefaultLayout() {
  return (
    <div className="overflow-x-hidden">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
