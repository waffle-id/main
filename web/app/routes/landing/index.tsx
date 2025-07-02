import { TextAnimation } from "~/components/waffle/logo/text-animation";
import { ArrowLink } from "~/components/waffle/button/arrow-button";
import { GradientBG } from "~/components/waffle/gradient-bg";
import { cn } from "~/utils/cn";

import { FeaturesBanner, FeaturesText } from "./shared/features";
import { LogoAnimationNoRepeat } from "~/components/waffle/logo/logo-animation-no-repeat";
import type { Route } from "./+types";
import { Separator } from "~/components/waffle/separator";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";
import { CommandLineTypo } from "~/components/waffle/typography/command-line-typo";
// import { PodiumLeaderboards } from "~/components/waffle/podium";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Waffle" }, { name: "description", content: "Welcome to Waffle!" }];
}

export default function Landing() {
  return (
    <>
      <GradientBG className="fixed h-1/3 -top-28 -right-12 blur-lg" />

      <div className="px-[20px] lg:px-[50px] mt-32">
        <div className="h-[90vh] flex flex-col">
          <TextAnimation className="h-max" />
          <div
            className={cn(
              "h-full flex flex-col items-center justify-center gap-12",
              "rounded-2xl backdrop-blur-[100px]"
            )}
          >
            <div className="flex flex-col gap-6 items-center">
              <CommandLineTypo className="text-7xl text-yelight-dark" scrollTrigger={false}>
                Reputation that Sticks.
              </CommandLineTypo>
              <p className="text-3xl w-3/4 text-center text-gray-dark">
                Start building your decentralized credibility. Backed by the community, not
                algorithms.
              </p>
            </div>
            <ButtonMagnet size="lg">Get Started</ButtonMagnet>
          </div>
        </div>
      </div>

      <div className="px-[20px] lg:px-[50px] h-screen">
        <div className="relative grid grid-cols-3 gap-x-12 items-center">
          <GradientBG className="absolute h-3/5 -left-96 blur-lg" />
          <p className="text-8xl text-yelight-dark">
            Own Your Reputation in
            <CommandLineTypo className="bg-linear-170 from-[#EB701F] to-[#F2DB34] bg-clip-text text-transparent">
              Web3
            </CommandLineTypo>
          </p>
          <div className="flex justify-center relative">
            <FeaturesBanner />
            {/* <p className="text-gray-dark rounded-lg backdrop-blur-lg bg-linear-170 from-[#FFF7F1] via-[#FFF7F1] to-[#FFDD86] h-max w-max px-8 py-4 absolute top-[55%]">
            "Awesome People"
          </p> */}
            <div className="absolute top-[55%]">
              <div className="absolute inset-0 blur rounded-lg bg-linear-170 from-[#FFF7F1] via-[#FFF7F1] to-[#FFDD86] z-0" />
              <p className="relative z-10 text-gray-dark text-xl px-8 py-4 w-max h-max rounded-lg">
                "Awesome People"
              </p>
            </div>
            {/* <p className="text-gray-dark rounded-lg backdrop-blur-lg bg-linear-170 from-[#FFF7F1] via-[#FFF7F1] to-[#FFDD86] h-max w-max px-8 py-4 absolute top-[70%] left-[20%]">
            "Awesome People"
          </p> */}
            <div className="absolute top-[70%] left-[20%]">
              <div className="absolute inset-0 blur rounded-lg bg-linear-170 from-[#FFF7F1] via-[#FFF7F1] to-[#FFDD86] z-0" />
              <p className="relative z-10 text-gray-dark text-xl px-8 py-4 w-max h-max rounded-lg">
                "Awesome People"
              </p>
            </div>
            {/* <p className="text-gray-dark rounded-lg backdrop-blur-lg bg-linear-170 from-[#FFF7F1] via-[#FFF7F1] to-[#FFDD86] h-max w-max px-8 py-4 absolute top-[85%] left-0">
            "Awesome People"
          </p> */}
            <div className="absolute top-[85%] left-0">
              <div className="absolute inset-0 blur rounded-lg bg-linear-170 from-[#FFF7F1] via-[#FFF7F1] to-[#FFDD86] z-0" />
              <p className="relative z-10 text-gray-dark text-xl px-8 py-4 w-max h-max rounded-lg">
                "Awesome People"
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <FeaturesText />
          </div>
        </div>
      </div>

      <div className="px-[20px] lg:px-[50px]">
        <div className="relative grid grid-cols-2">
          <GradientBG className="absolute h-96 -left-40 blur-lg" />
          <div className="flex flex-col items-center justify-center gap-16">
            <div className="flex flex-col items-center gap-6 rounded-lg backdrop-blur-lg bg-linear-170 from-[#FFF7F1] via-[#FFF7F1] to-[#FFDD86] h-max w-1/2 px-8 py-4">
              <img src="/icons/users.svg" alt="builda reputation" className="size-24" />
              <p className="text-gray-dark text-xl">Build a reputation that you own</p>
            </div>
            <div className="relative w-1/2 h-max px-8 py-4 rounded-lg overflow-hidden">
              <div className="absolute inset-0 z-0 blur-2xl opacity-60 bg-gradient-to-br from-[#FFF7F1] via-[#FFF7F1] to-[#FFDD86]" />
              <div className="relative z-10 flex flex-col items-center gap-6">
                <img src="/icons/users.svg" alt="build a reputation" className="size-24" />
                <p className="text-gray-dark text-xl">Build a reputation that you own</p>
              </div>
            </div>
            <div className="relative w-1/2 h-max px-8 py-4 rounded-lg overflow-hidden">
              <div className="absolute inset-0 z-0 blur-2xl opacity-60 bg-gradient-to-br from-[#FFF7F1] via-[#FFF7F1] to-[#FFDD86]" />
              <div className="relative z-10 flex flex-col items-center gap-6">
                <img src="/icons/trust.svg" alt="build a reputation" className="size-24" />
                <p className="text-gray-dark text-xl">Let community trust be your portfolio</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-16">
            <LogoAnimationNoRepeat className="h-1/2" />
            <CommandLineTypo className="text-6xl text-gray-dark font-semibold">
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

      <div className="px-[20px] lg:px-[50px]">
        <div className="grid grid-cols-1 lg:grid-cols-11 max-w-[90%] mx-auto text-black">
          <div className="col-span-1 lg:col-span-5 relative flex flex-col justify-center px-4">
            <LogoAnimationNoRepeat className="h-1/2" disable={true} />
          </div>
          <div className="col-span-1 lg:col-span-5 lg:col-start-7 flex flex-col justify-center px-4">
            <h2 className="flex flex-row items-center mt-12 gap-x-4">
              <p className="text-2xl md:text-3xl font-medium">Waffle</p>
            </h2>
            <h1 className="mt-8 md:mt-12 text-2xl md:text-4xl leading-tight">
              Waffle <span className="italic font-medium">Waffle</span> cupcake ipsum dolor sit
              amet. Cupcake ipsum dolor sit amet.
            </h1>
            <CommandLineTypo className="mt-6 md:mt-8 text-xl md:text-3xl leading-tight text-gray-dark">
              <span>Sound interesting? </span>
              <span className="text-foreground">Try it yourself</span>.
            </CommandLineTypo>
            <ArrowLink className="mt-10 md:mt-20" href="https://t.me/HappyCuanAirdrop">
              Join now
            </ArrowLink>
          </div>
        </div>
      </div>
    </>
  );
}
