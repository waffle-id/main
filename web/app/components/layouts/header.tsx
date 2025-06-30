import { cn } from "~/utils/cn";
import { LogoAnimation } from "../waffle/logo/logo-animation";
import { useEffect, useState, type JSX } from "react";

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
      <div className="flex flex-nowrap items-center justify-between w-full gap-4 overflow-x-auto">
        <LogoAnimation className="h-14 w-max aspect-square flex-shrink-0" />
        <div className="flex-shrink-0 text-black">
          <p>Connect Wallet</p>
        </div>
      </div>
    </div>
  );
}
