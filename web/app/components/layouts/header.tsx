import { cn } from "~/utils/cn";
import { LogoAnimation } from "../waffle/logo/logo-animation";
import { useEffect, useState, type JSX } from "react";
import { NavLink } from "../waffle/nav-link";

const LINKS_HEADER: Record<string, string>[] = [
  {
    to: "/",
    text: "Home",
  },
  {
    to: "/categories",
    text: "Categories",
  },
  {
    to: "/leaderboard",
    text: "Leaderboard",
  },
  {
    to: "/profile",
    text: "[DEV] Profile",
  },
];

export function Header({ className }: JSX.IntrinsicElements["div"]) {
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    document && document.documentElement.scrollTop > 0 && setScrolling(true);

    function handleScroll(e: Event) {
      if (e.target instanceof Document) {
        if (e.target.documentElement.scrollTop > 0) {
          setScrolling(true);
        } else {
          setScrolling(false);
        }
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={cn(
        "absolute lg:fixed left-0 w-full py-6 px-4 sm:px-6 md:px-10 z-50 rounded-b-lg",
        scrolling && "backdrop-blur-md border-foreground",
        className
      )}
    >
      <div className="flex flex-nowrap items-center justify-between w-full gap-4 overflow-hidden">
        <LogoAnimation className="h-14 w-max aspect-square" />

        <nav className="flex flex-row gap-4 md:gap-8 lg:gap-12">
          {LINKS_HEADER.map((link, i) => (
            <NavLink key={link.to} to={link.to} prefetch="intent">
              {link.text}
            </NavLink>
          ))}
          <p className="text-black">Connect Wallet</p>
        </nav>
      </div>
    </div>
  );
}
