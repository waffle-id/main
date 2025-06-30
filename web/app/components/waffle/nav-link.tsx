import { Link, useLocation } from "react-router";
import { cn } from "~/utils/cn";

export function NavLink({ to, children, ...rest }: Parameters<typeof Link>["0"]) {
  const location = useLocation();
  const isSelected = to === location.pathname || location.pathname.startsWith(`${to}/`);

  return (
    <Link
      to={to}
      prefetch="intent"
      className={cn("underlined focus:outline-none text-black ", isSelected && "active")}
      {...rest}
    >
      {children}
    </Link>
  );
}
