import { Outlet } from "react-router";
import { Header } from "~/components/layouts/header";
import { Footer } from "~/components/layouts/footer";

export default function DefaultLayout() {
  return (
    <div className="overflow-x-hidden">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
