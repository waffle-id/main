import { Outlet } from "react-router";
import { Header } from "~/components/layouts/header";

export default function DefaultLayout() {
  return (
    <div className="overflow-x-hidden">
      <Header />
      <Outlet />
    </div>
  );
}
