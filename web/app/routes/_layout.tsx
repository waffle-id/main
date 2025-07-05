import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { Outlet } from "react-router";
import { Header } from "~/components/layouts/header";
import { Footer } from "~/components/layouts/footer";
import { sessionStorage } from "~/services/session.server";
import { useWaffleProvider } from "~/components/waffle/waffle-provider";
import { useEffect } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));

  return {
    user: session.get("user"),
  };
}

export default function DefaultLayout() {
  const loaderData = useLoaderData<typeof loader>();
  const { user } = loaderData;

  const { setTwitterUser } = useWaffleProvider();

  useEffect(() => {
    setTwitterUser(user ?? null);
  }, [user, setTwitterUser]);

  return (
    <div className="overflow-x-hidden">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
