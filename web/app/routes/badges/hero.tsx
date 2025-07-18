import { TextStaticAnimation } from "~/components/waffle/logo/text-static-animation";
import type { BadgeItemProps } from "./badge-item";

export function BadgeHero({ badges }: { badges: BadgeItemProps[] }) {
  return (
    <div className="grid grid-cols-2 h-[50vh]">
      <div className="flex flex-col justify-between mt-24">
        <div className="flex flex-col gap-2">
          <p className="text-gray-dark">Earn Your Recognition</p>
          <p className="text-black text-5xl">Badges</p>
          <p className="w-1/2 text-black">
            Build your reputation through meaningful contributions and unlock exclusive badges that
            showcase your impact in the Web3 community.
          </p>
        </div>
        <TextStaticAnimation className="w-max" />
      </div>
      <div className="flex items-center justify-around mt-4 w-full">
        <div className="flex flex-col gap-2 items-center">
          <p className="text-8xl font-bold text-foreground">{badges.length}</p>
          <div className="text-sm text-gray-dark">Available Badges</div>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <p className="text-8xl font-bold text-foreground">
            {badges.reduce((sum, badge) => sum + (badge.earned || 0), 0).toLocaleString()}
          </p>
          <div className="text-sm text-gray-dark">Total Earned</div>
        </div>
      </div>
    </div>
  );
}
