import { MoveDown } from "lucide-react";
import { CommandLineTypo } from "~/components/waffle/typography/command-line-typo";

export function ProfileSkeleton() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center pointer-events-none z-10">
        <div className="text-[8vw] font-bold font-sans m-0 bg-gray-300 animate-pulse rounded-lg h-[10vw] w-[40vw]"></div>
        <CommandLineTypo className="flex flex-row text-xl font-normal m-0 italic items-center gap-2 mt-4">
          loading profile...
          <MoveDown className="size-6 animate-bounce" />
        </CommandLineTypo>
      </div>

      <div className="relative z-0 w-full min-h-screen">
        <div className="grid grid-cols-8 auto-rows-[1fr] gap-2 w-full mt-32">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-300 animate-pulse aspect-square rounded-full"
              style={{
                gridRow: Math.floor(i / 2) + 1,
                gridColumn: (i % 8) + 1,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 h-screen bg-gray-200 text-black flex flex-col items-center justify-center px-4">
        <div className="bg-gray-300 animate-pulse rounded-lg h-[5vh] w-[40ch] max-w-full"></div>
        <div className="absolute bottom-0 px-[20px] lg:px-[50px] mb-20 w-full">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-8">
              <div className="size-32 bg-gray-300 animate-pulse rounded-full aspect-square"></div>
              <div className="flex flex-col gap-2">
                <div className="bg-gray-300 animate-pulse rounded-lg h-8 w-32"></div>
                <div className="bg-gray-300 animate-pulse rounded-lg h-6 w-48"></div>
                <div className="bg-gray-300 animate-pulse rounded-lg h-4 w-24"></div>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex flex-row items-center justify-end gap-8">
                <div className="bg-gray-300 animate-pulse rounded-lg size-6"></div>
                <div className="bg-gray-300 animate-pulse rounded-lg size-6"></div>
                <div className="bg-gray-300 animate-pulse rounded-lg size-6"></div>
              </div>
              <div className="flex flex-row gap-8 items-center">
                <div className="flex flex-col items-end gap-2">
                  <div className="bg-gray-300 animate-pulse rounded-lg h-12 w-20"></div>
                  <div className="bg-gray-300 animate-pulse rounded-lg h-4 w-32"></div>
                </div>
                <div className="bg-gray-300 animate-pulse rounded-lg size-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-[20px] lg:px-[50px] py-24 relative z-20 bg-background text-black">
        <div className="flex flex-col gap-12">
          <div className="flex flex-row items-center gap-4 justify-end">
            <div className="bg-gray-300 animate-pulse rounded-lg h-10 w-20"></div>
            <div className="bg-gray-300 animate-pulse rounded-lg h-10 w-20"></div>
            <div className="bg-gray-300 animate-pulse rounded-lg h-10 w-20"></div>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-300 animate-pulse rounded-lg h-12 w-full"></div>
            <div className="bg-gray-300 animate-pulse rounded-lg h-32 w-full"></div>
          </div>
        </div>
      </div>
    </>
  );
}
