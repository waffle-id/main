import { LogoAnimation } from "../waffle/logo/logo-animation";
import { LogoAnimationNoRepeat } from "../waffle/logo/logo-animation-no-repeat";
import { TextStaticAnimation } from "../waffle/logo/text-static-animation";

export function Footer() {
  return (
    <div className="px-[20px] lg:px-[50px]">
      <div className="col-start-1 row-start-3 md:col-start-2 relative before:absolute before:top-0 before:h-px before:w-[200vw] before:bg-foreground before:-left-[100vw] after:absolute after:bottom-0 after:h-px after:w-[200vw] after:bg-foreground after:-left-[100vw]">
        <footer className="text-sm/loose text-gray-950">
          <div className="mx-auto hidden w-full grid-cols-4 justify-between gap-y-0 md:grid md:grid-cols-4 md:gap-6 md:gap-x-4 lg:gap-8 *:first:border-l-0 *:last:border-r-0">
            <div className="border-x border-b border-foreground py-10 pl-2 not-md:border-0 md:border-b-0">
              <div className="flex h-full items-center justify-center">
                <TextStaticAnimation className="w-full" />
              </div>
            </div>
            <div className="border-x border-b border-foreground py-10 pl-2 not-md:border-0 md:border-b-0">
              <h3 className="font-semibold">Waffle</h3>
              <ul className="mt-4 grid gap-4">
                <li>
                  <a className="hover:underline" href="https://www.refactoringui.com">
                    About Us
                  </a>
                </li>
                <li>
                  <a className="hover:underline" href="https://headlessui.com">
                    More
                  </a>
                </li>
                <li>
                  <a className="hover:underline" href="https://heroicons.com">
                    More
                  </a>
                </li>
                <li>
                  <a className="hover:underline" href="https://heropatterns.com">
                    More
                  </a>
                </li>
              </ul>
            </div>
            <div className="border-x border-b border-foreground py-10 pl-2 not-md:border-0 sm:border-b-0">
              <h3 className="font-semibold">Community</h3>
              <ul className="mt-4 grid gap-4">
                <li>
                  <a className="hover:underline" href="https://github.com/tailwindlabs/tailwindcss">
                    GitHub
                  </a>
                </li>
                <li>
                  <a className="hover:underline" href="https://tailwindcss.com/discord">
                    Discord
                  </a>
                </li>
                <li>
                  <a className="hover:underline" href="https://x.com/tailwindcss">
                    X
                  </a>
                </li>
              </ul>
            </div>
            <div className="border-x border-foreground py-10 pl-2 not-md:border-0">
              <div className="flex items-center justify-center">
                <LogoAnimationNoRepeat className="aspect-square size-52" />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
