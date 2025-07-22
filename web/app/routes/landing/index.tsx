import { TextAnimation } from "~/components/waffle/logo/text-animation";
import { ArrowLink } from "~/components/waffle/button/arrow-button";
import { GradientBG } from "~/components/waffle/gradient-bg";
import { cn } from "~/utils/cn";
import { generateSEO, SEO_CONFIGS } from "~/utils/seo";

import { FeaturesBanner, FeaturesText } from "./shared/features";
import { LogoAnimationNoRepeat } from "~/components/waffle/logo/logo-animation-no-repeat";
import type { Route } from "./+types";
import { Separator } from "~/components/waffle/separator";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";
import { CommandLineTypo } from "~/components/waffle/typography/command-line-typo";
import { BadgeCheck } from "lucide-react";
// import { PodiumLeaderboards } from "~/components/waffle/podium";

export function meta({ }: Route.MetaArgs): Route.MetaDescriptors {
  return generateSEO(SEO_CONFIGS.home);
}

export default function Landing() {
  return (
    <>
      <GradientBG className="fixed h-1/3 -top-28 -right-12 blur-lg" />

      <div className="px-4 sm:px-6 md:px-8 lg:px-[50px] mt-16 sm:mt-20 md:mt-24 lg:mt-32">
        <div className="min-h-[80vh] sm:h-[85vh] md:h-[90vh] flex flex-col">
          <TextAnimation className="h-max" />
          <div
            className={cn(
              "h-full flex flex-col items-center justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12",
              "rounded-xl md:rounded-2xl backdrop-blur-[100px]"
            )}
          >
            <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 items-center text-center px-4">
              <CommandLineTypo className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-yelight-dark" scrollTrigger={false}>
                Reputation that Sticks.
              </CommandLineTypo>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl w-full sm:w-5/6 md:w-4/5 lg:w-3/4 text-center text-gray-dark">
                Start building your decentralized credibility. Backed by the community, not
                algorithms.
              </p>
            </div>
            <ButtonMagnet size="lg">Get Started</ButtonMagnet>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-8 lg:px-[50px] min-h-screen">
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-x-12 items-center">
          <GradientBG className="absolute h-3/5 -left-96 blur-lg" />
          <div className="lg:col-span-1 order-2 lg:order-1">
            <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-yelight-dark text-center lg:text-left">
              Own Your Reputation in
              <CommandLineTypo className="bg-linear-170 from-[#EB701F] to-[#F2DB34] bg-clip-text text-transparent block sm:inline">
                Web3
              </CommandLineTypo>
            </p>
          </div>
          <div className="lg:col-span-1 flex justify-center relative order-1 lg:order-2">
            <FeaturesBanner />
            <div className="absolute top-[45%] sm:top-[50%] md:top-[55%]">
              <div className="absolute inset-0 blur rounded-lg bg-linear-170 from-[#FFF7F1] via-[#FFF7F1] to-[#FFDD86] z-0" />
              <p className="relative z-10 text-gray-dark text-sm sm:text-base md:text-lg lg:text-xl px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 w-max h-max rounded-lg">
                "Trustworthy Builder"
              </p>
            </div>
            <div className="absolute top-[60%] sm:top-[65%] md:top-[70%] left-[10%] sm:left-[15%] md:left-[20%]">
              <div className="absolute inset-0 blur rounded-lg bg-linear-170 from-[#FFF7F1] via-[#FFF7F1] to-[#FFDD86] z-0" />
              <p className="relative z-10 text-gray-dark text-sm sm:text-base md:text-lg lg:text-xl px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 w-max h-max rounded-lg">
                "Reliable Expert"
              </p>
            </div>
            <div className="absolute top-[75%] sm:top-[80%] md:top-[85%] left-0">
              <div className="absolute inset-0 blur rounded-lg bg-linear-170 from-[#FFF7F1] via-[#FFF7F1] to-[#FFDD86] z-0" />
              <p className="relative z-10 text-gray-dark text-sm sm:text-base md:text-lg lg:text-xl px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 w-max h-max rounded-lg">
                "Community Verified"
              </p>
            </div>
          </div>
          <div className="lg:col-span-1 flex flex-col gap-4 order-3">
            <FeaturesText />
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-8 lg:px-[50px] min-h-screen">
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <GradientBG className="absolute h-96 -left-40 blur-lg" />
          <div className="flex flex-col items-center justify-center gap-8 sm:gap-12 md:gap-16 order-2 lg:order-1">
            <div className="relative w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-max px-6 sm:px-8 py-4 sm:py-6 rounded-lg overflow-hidden">
              <div className="absolute inset-0 z-0 blur-2xl opacity-60 bg-gradient-to-br from-[#FFF7F1] via-[#FFF7F1] to-[#FFDD86]" />
              <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6">
                <BadgeCheck className="size-16 sm:size-20 md:size-24" />
                <p className="text-gray-dark text-lg sm:text-xl text-center">Build a reputation that you own</p>
              </div>
            </div>
            <div className="relative w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-max px-6 sm:px-8 py-4 sm:py-6 rounded-lg overflow-hidden">
              <div className="absolute inset-0 z-0 blur-2xl opacity-60 bg-gradient-to-br from-[#FFF7F1] via-[#FFF7F1] to-[#FFDD86]" />
              <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6">
                <img src="/icons/users.svg" alt="decentralized identity" className="size-16 sm:size-20 md:size-24" />
                <p className="text-gray-dark text-lg sm:text-xl text-center">Your identity, truly decentralized</p>
              </div>
            </div>
            <div className="relative w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-max px-6 sm:px-8 py-4 sm:py-6 rounded-lg overflow-hidden">
              <div className="absolute inset-0 z-0 blur-2xl opacity-60 bg-gradient-to-br from-[#FFF7F1] via-[#FFF7F1] to-[#FFDD86]" />
              <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6">
                <img src="/icons/trust.svg" alt="community trust" className="size-16 sm:size-20 md:size-24" />
                <p className="text-gray-dark text-lg sm:text-xl text-center">Let community trust be your portfolio</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-8 sm:gap-12 md:gap-16 order-1 lg:order-2">
            <LogoAnimationNoRepeat className="h-1/3 sm:h-2/5 md:h-1/2" />
            <CommandLineTypo className="text-4xl sm:text-5xl md:text-6xl text-gray-dark font-semibold text-center">
              Why{" "}
              <span className="bg-linear-170 from-[#EB701F] to-[#F2DB34] bg-clip-text text-transparent">
                Waffle?
              </span>
            </CommandLineTypo>
          </div>
        </div>
      </div>

      <div className="relative">
        <Separator />
      </div>

      {/* <div className="h-screen w-full">
        <div className="w-1/2 m-auto">
          <PodiumLeaderboards />
        </div>
      </div> */}

      <div className="px-4 sm:px-6 md:px-8 lg:px-[50px] pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-11 max-w-[95%] sm:max-w-[90%] mx-auto text-black">
          <div className="col-span-1 lg:col-span-5 relative flex flex-col justify-center px-2 sm:px-4 order-2 lg:order-1">
            <LogoAnimationNoRepeat className="h-64 sm:h-80 md:h-96 lg:h-1/2" disable={true} />
          </div>
          <div className="col-span-1 lg:col-span-5 lg:col-start-7 flex flex-col justify-center px-2 sm:px-4 order-1 lg:order-2">
            <h2 className="flex flex-row items-center mt-8 sm:mt-10 md:mt-12 gap-x-4">
              <p className="text-xl sm:text-2xl md:text-3xl font-medium">Waffle</p>
            </h2>
            <h1 className="mt-6 sm:mt-8 md:mt-12 text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight">
              Build trust through <span className="italic font-medium">community-driven</span>{" "}
              reputation scoring that follows you across Web3.
            </h1>
            <CommandLineTypo className="mt-4 sm:mt-6 md:mt-8 text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight text-gray-dark">
              <span>Ready to build your reputation? </span>
              <span className="text-foreground">Start earning trust today</span>.
            </CommandLineTypo>
            <ArrowLink className="my-8 sm:my-12 md:my-16 lg:my-20" href="/auth/twitter">
              Get Started
            </ArrowLink>
          </div>
        </div>
      </div>
    </>
  );
}
