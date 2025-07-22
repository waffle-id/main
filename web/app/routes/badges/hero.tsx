import { TextStaticAnimation } from "~/components/waffle/logo/text-static-animation";
import type { BadgeItemProps } from "./badge-item";

export function BadgeHero({ badges }: { badges: BadgeItemProps[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-[50vh] lg:h-[50vh] px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 lg:py-0">
      <div className="flex flex-col justify-center lg:justify-between mt-0 lg:mt-24 order-1 lg:order-1">
        <div className="flex flex-col gap-3 sm:gap-4 text-center lg:text-left">
          <p className="text-gray-dark text-sm sm:text-base">Earn Your Recognition</p>
          <p className="text-black text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold leading-tight">Badges</p>
          <p className="w-full lg:w-1/2 text-black text-base sm:text-lg leading-relaxed">
            Build your reputation through meaningful contributions and unlock exclusive badges that
            showcase your impact in the Web3 community.
          </p>
        </div>
        <div className="mt-8 lg:mt-0 flex justify-center lg:justify-start">
          <TextStaticAnimation className="w-max" />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row lg:flex-row items-center justify-center lg:justify-around gap-8 sm:gap-12 lg:gap-8 mt-0 lg:mt-4 w-full order-2 lg:order-2">
        <div className="flex flex-col gap-2 sm:gap-3 items-center text-center">
          <p className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground leading-none">{badges.length}</p>
          <div className="text-sm sm:text-base text-gray-dark">Available Badges</div>
        </div>
        <div className="flex flex-col gap-2 sm:gap-3 items-center text-center">
          <p className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground leading-none">
            {badges.reduce((sum, badge) => sum + (badge.earned || 0), 0).toLocaleString()}
          </p>
          <div className="text-sm sm:text-base text-gray-dark">Total Earned</div>
        </div>
      </div>
    </div>
  );
}
