import { cn } from "~/utils/cn";
import { LogoAnimation } from "../waffle/logo/logo-animation";
import { useEffect, useState, type JSX } from "react";
import { NavLink } from "../waffle/nav-link";
import { ConnectWalletXellar } from "../waffle/wallet/connect-wallet-xellar";
// import { ConnectWalletRainbow } from "../waffle/wallet/connect-wallet-rainbow";

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
    to: "/badges",
    text: "Badges",
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
        "absolute lg:fixed left-0 w-full py-4 lg:py-6 px-4 sm:px-6 md:px-8 lg:px-10 z-50 rounded-b-lg transition-all duration-300 overflow-hidden",
        scrolling && "backdrop-blur-md bg-white/80 border-b border-orange-200/50 shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between w-full mx-auto">
        <div className="flex-shrink-0">
          <NavLink to={"/"} prefetch="intent" className="no-underline">
            <LogoAnimation className="h-12 lg:h-14 w-max aspect-square" />
          </NavLink>
        </div>

        <nav className="hidden md:flex items-center space-x-2 lg:space-x-6 xl:space-x-8">
          {LINKS_HEADER.map((link, i) => (
            <NavLink
              key={link.to}
              to={link.to}
              prefetch="intent"
              className="relative px-3 lg:px-4 py-2 text-sm lg:text-base font-medium text-gray-700 hover:text-orange-600 transition-colors duration-200 rounded-lg hover:bg-orange-50/50"
            >
              {link.text}
            </NavLink>
          ))}
        </nav>

        <div className="md:hidden">
          <button
            className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
            aria-label="Open navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <div className="flex-shrink-0">
          <ConnectWalletXellar />
        </div>
      </div>

      <div className="md:hidden mt-4 pt-4 border-t border-orange-200/50 hidden">
        <nav className="space-y-2">
          {LINKS_HEADER.map((link, i) => (
            <NavLink
              key={link.to}
              to={link.to}
              prefetch="intent"
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50/50 rounded-lg transition-colors duration-200"
            >
              {link.text}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
