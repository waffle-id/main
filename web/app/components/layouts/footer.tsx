import { LogoAnimationNoRepeat } from "../waffle/logo/logo-animation-no-repeat";
import { TextStaticAnimation } from "../waffle/logo/text-static-animation";

export function Footer() {
  return (
    <div className="px-[20px] lg:px-[50px] relative bg-gradient-to-br from-background via-orange-25 to-orange-50 overflow-hidden">
      <div className="relative">
        <div className="absolute -top-1 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-orange-200 to-transparent blur-sm opacity-40 animate-pulse"></div>
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-300 via-yellow-400 to-orange-300 rounded-full opacity-70 shadow-sm"></div>
        <div className="absolute top-1 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-50"></div>

        <footer className="text-sm/loose text-gray-950 pt-12">
          <div className="mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 lg:gap-8">
            <div className="group flex flex-col items-center justify-center bg-gradient-to-br from-white/70 to-orange-50/60 backdrop-blur-md rounded-3xl p-6 border-2 border-orange-200/60 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 to-yellow-100/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <TextStaticAnimation className="w-full relative z-10" />
              <p className="text-xs text-gray-600 mt-2 text-center relative z-10">
                Building trust, one waffle at a time ✨
              </p>
            </div>

            <div className="group bg-gradient-to-br from-white/50 to-orange-50/40 backdrop-blur-md rounded-3xl p-6 border-2 border-orange-150/50 shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100/10 to-yellow-100/10 rounded-3xl opacity-0 duration-500"></div>
              <h3 className="font-semibold text-orange-800 mb-4 text-base relative z-10 flex items-center gap-2">
                <span className="text-xl">🧇</span> Waffle
              </h3>
              <ul className="space-y-3 relative z-10">
                <li>
                  <a
                    className="flex items-center gap-3 py-1 px-2 rounded-xl group/link"
                    href="/about"
                  >
                    <span className="w-2 h-2 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full shadow-sm transition-all duration-300"></span>{" "}
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center gap-3 py-1 px-2 rounded-xl group/link"
                    href="/badges"
                  >
                    <span className="w-2 h-2 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full shadow-sm transition-all duration-300"></span>{" "}
                    Badges
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center gap-3 py-1 px-2 rounded-xl group/link"
                    href="/leaderboard"
                  >
                    <span className="w-2 h-2 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full shadow-sm transition-all duration-300"></span>{" "}
                    Leaderboard
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center gap-3 py-1 px-2 rounded-xl group/link"
                    href="/categories"
                  >
                    <span className="w-2 h-2 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full shadow-sm transition-all duration-300"></span>{" "}
                    Categories
                  </a>
                </li>
              </ul>
            </div>

            <div className="group bg-gradient-to-br from-white/50 to-orange-50/40 backdrop-blur-md rounded-3xl p-6 border-2 border-orange-150/50 shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100/10 to-yellow-100/10 rounded-3xl opacity-0"></div>
              <h3 className="font-semibold text-orange-800 mb-4 text-base relative z-10 flex items-center gap-2">
                <span className="text-xl">🌟</span> Community
              </h3>
              <ul className="space-y-3 relative z-10">
                <li>
                  <a
                    className="flex items-center gap-3 py-1 px-2 rounded-xl group/link"
                    href="https://github.com/waffle-id"
                  >
                    <span className="w-2 h-2 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full shadow-sm transition-all duration-300"></span>{" "}
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center gap-3 py-1 px-2 rounded-xl group/link"
                    href="https://discord.gg/waffle"
                  >
                    <span className="w-2 h-2 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full shadow-sm transition-all duration-300"></span>{" "}
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center gap-3 py-1 px-2 rounded-xl group/link"
                    href="https://x.com/waffle_id"
                  >
                    <span className="w-2 h-2 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full shadow-sm transition-all duration-300"></span>{" "}
                    X (Twitter)
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center gap-3 py-1 px-2 rounded-xl group/link"
                    href="https://t.me/waffle_community"
                  >
                    <span className="w-2 h-2 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full shadow-sm transition-all duration-300"></span>{" "}
                    Telegram
                  </a>
                </li>
              </ul>
            </div>

            <div className="group flex flex-col items-center justify-center bg-gradient-to-br from-orange-100/80 to-yellow-100/70 backdrop-blur-md rounded-3xl p-6 border-2 border-orange-250/60 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200/20 to-yellow-200/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <LogoAnimationNoRepeat className="aspect-square size-32 mb-2 relative z-10 drop-shadow-sm" />
              <p className="text-xs text-orange-700 font-medium relative z-10 flex items-center gap-1">
                Sweet Reputation <span className="text-yellow-500">🍯</span>
              </p>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-gradient-to-r from-transparent via-orange-200/50 to-transparent relative">
            <div className="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-orange-300/70 to-transparent"></div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-white/30 via-orange-50/40 to-white/30 backdrop-blur-sm rounded-2xl p-6 border border-orange-200/50 shadow-sm">
              <p className="text-xs text-gray-600 flex items-center gap-2">
                © {new Date().getFullYear()} Waffle. Building decentralized trust with sweetness.
                <span className="text-orange-400">🧇</span>
              </p>
              <div className="flex gap-6 text-xs">
                <a
                  href="/privacy"
                  className="hover:text-orange-600 transition-all duration-300 py-1 px-3 rounded-lg hover:bg-orange-100/50"
                >
                  Privacy
                </a>
                <a
                  href="/terms"
                  className="hover:text-orange-600 transition-all duration-300 py-1 px-3 rounded-lg hover:bg-orange-100/50"
                >
                  Terms
                </a>
                <a
                  href="/support"
                  className="hover:text-orange-600 transition-all duration-300 py-1 px-3 rounded-lg hover:bg-orange-100/50"
                >
                  Support
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
