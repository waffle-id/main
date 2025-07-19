import { TextStaticAnimation } from "~/components/waffle/logo/text-static-animation";
import type { BadgeItemProps } from "./badge-item";

export function BadgeHero({ badges }: { badges: BadgeItemProps[] }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-white to-yellow-50/30 -z-10" />

      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-yellow-300/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-gradient-to-br from-yellow-200/20 to-orange-300/20 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center min-h-[75vh] lg:min-h-[70vh] py-16 lg:py-20">
          <div className="lg:col-span-7 space-y-8 lg:space-y-10 text-center lg:text-left">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full border border-orange-200/50">
                <span className="text-sm md:text-base font-medium text-orange-700">
                  🏆 Earn Your Recognition
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Badges
                </span>
              </h1>

              <p className="text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Build your reputation through meaningful contributions and unlock exclusive badges
                that showcase your impact in the Web3 community.
              </p>
            </div>

            <div className="flex justify-center lg:justify-start">
              <TextStaticAnimation className="w-max" />
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="space-y-6 md:space-y-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 lg:p-10 border border-orange-100/50 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                  <div className="space-y-3 md:space-y-4">
                    <p className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-gradient-to-br from-orange-600 to-yellow-600 bg-clip-text text-transparent leading-none">
                      {badges.length}
                    </p>
                    <div className="text-sm md:text-base lg:text-lg text-gray-600 font-medium">
                      Available Badges
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 lg:p-10 border border-yellow-100/50 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                  <div className="space-y-3 md:space-y-4">
                    <p className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-br from-yellow-600 to-orange-600 bg-clip-text text-transparent leading-none">
                      {badges.reduce((sum, badge) => sum + (badge.earned || 0), 0).toLocaleString()}
                    </p>
                    <div className="text-sm md:text-base lg:text-lg text-gray-600 font-medium">
                      Total Earned
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
