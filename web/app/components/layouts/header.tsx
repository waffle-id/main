import { cn } from "~/utils/cn";
import { LogoAnimation } from "../waffle/logo/logo-animation";
import { useEffect, useState, type JSX } from "react";
import { NavLink } from "../waffle/nav-link";
import { ConnectWalletXellar } from "../waffle/wallet/connect-wallet-xellar";
import { SearchButton } from "../waffle/search/search-bar";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;
      if (
        target.closest("[data-mobile-menu-backdrop]") &&
        !target.closest("[data-mobile-menu-panel]")
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 w-full py-4 lg:py-6 px-4 sm:px-6 md:px-8 lg:px-10 z-50 transition-all duration-300 overflow-hidden",
        scrolling &&
          "lg:backdrop-blur-md lg:bg-white/80 lg:border-b lg:border-yellow-200/50 lg:shadow-sm",
        scrolling && "bg-white border-b border-gray-200 shadow-md",
        className
      )}
    >
      <div className="flex items-center justify-between w-full mx-auto transition-opacity duration-300">
        <div className="flex-shrink-0">
          <NavLink to={"/"} prefetch="intent" className="no-underline">
            <LogoAnimation className="h-12 lg:h-14 w-max aspect-square" />
          </NavLink>
        </div>

        <nav className="hidden lg:flex items-center space-x-2 lg:space-x-6 xl:space-x-8">
          {LINKS_HEADER.map((link, i) => (
            <NavLink
              key={link.to}
              to={link.to}
              prefetch="intent"
              className="relative px-3 lg:px-4 py-2 text-sm lg:text-base font-medium text-gray-700 hover:text-yellow-600 transition-colors duration-200 rounded-lg hover:bg-yellow-50/50"
            >
              {link.text}
            </NavLink>
          ))}
          <SearchButton />
        </nav>

        <div className="lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="w-6 h-6 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        <div className="hidden lg:flex items-center space-x-2">
          <div className="flex-shrink-0">
            <ConnectWalletXellar />
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          data-mobile-menu-backdrop
          className="lg:hidden fixed inset-0 z-40 transition-all duration-300 ease-in-out"
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

          <div
            data-mobile-menu-panel
            className={cn(
              "absolute top-0 left-0 w-full h-full bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
              isMobileMenuOpen ? "transform translate-x-0" : "transform -translate-x-full"
            )}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 shrink-0">
              <div className="flex-shrink-0">
                <NavLink
                  to={"/"}
                  prefetch="intent"
                  className="no-underline"
                  onClick={closeMobileMenu}
                >
                  <LogoAnimation className="h-10 w-max aspect-square" />
                </NavLink>
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
                aria-label="Close navigation menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <nav className="h-full px-4 py-6 flex flex-col justify-between">
                <div className="space-y-2">
                  {LINKS_HEADER.map((link, i) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      prefetch="intent"
                      onClick={closeMobileMenu}
                      className="block px-4 py-4 text-lg font-medium text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
                    >
                      {link.text}
                    </NavLink>
                  ))}
                </div>

                <div className="pt-4 -mx-4">
                  <div className="flex items-center justify-center px-4">
                    <ConnectWalletXellar className="w-full" />
                  </div>
                </div>
              </nav>
            </div>

            <div className="shrink-0 px-4 py-4 border-t border-gray-200 bg-gray-50">
              <SearchButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
