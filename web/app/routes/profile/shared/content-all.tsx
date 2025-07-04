import { Award, BadgeDollarSign } from "lucide-react";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";
import { LogoAnimationNoRepeat } from "~/components/waffle/logo/logo-animation-no-repeat";

export function ContentAll() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-4 w-full text-black text-md">
        <p className="text-black text-sm border-b border-gray-400 border-dashed py-3">Activity</p>
        <p className="text-black text-sm border-b border-gray-400 border-dashed py-3">Date</p>
        <p className="text-black text-sm border-b border-gray-400 border-dashed py-3">Actor</p>
        <p className="text-black text-sm border-b border-gray-400 border-dashed py-3">Subject</p>
        {new Array(20).fill("").map((val, idx) => (
          <>
            <div className="border-b border-gray-400 border-dashed py-3">
              <div className="flex items-center h-full">
                <div className="flex flex-row w-max items-center gap-4">
                  {idx % 2 == 0 ? (
                    <>
                      <BadgeDollarSign className="size-5 text-foreground" />
                      <p className="ml-1">Vouch</p>
                    </>
                  ) : (
                    <>
                      <LogoAnimationNoRepeat className="size-5" />
                      <p className="ml-1">Positive Review</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="border-b border-gray-400 border-dashed py-3">
              <div className="flex items-center h-full">
                <p>$2000</p>
              </div>
            </div>
            <div className="border-b border-gray-400 border-dashed py-3">
              <div className="flex flex-row gap-4 items-center">
                <div className="relative size-10 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-red-500 rounded-full"></div>
                  <img
                    className="relative z-10 size-10 aspect-square rounded-full p-1"
                    src={`https://api.dicebear.com/9.x/big-smile/svg?seed=actor${idx}`}
                    alt=""
                  />
                </div>
                <p>User{String(idx + 1).padStart(3, "0")}</p>
              </div>
            </div>
            <div className="border-b border-gray-400 border-dashed py-3">
              <div className="flex flex-row gap-4 items-center">
                <div className="relative size-10 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full"></div>
                  <img
                    className="relative z-10 size-10 aspect-square rounded-full p-1"
                    src={`https://api.dicebear.com/9.x/big-smile/svg?seed=subject${idx}`}
                    alt=""
                  />
                </div>
                <p>Subject{String(idx + 1).padStart(3, "0")}</p>
              </div>
            </div>
          </>
        ))}
      </div>
      <ButtonMagnet className="w-max self-center mt-12" size="lg">
        Load More
      </ButtonMagnet>
    </div>
  );
}
