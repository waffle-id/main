// import { RetroButton } from "~/components/waffle/retro-button";
import type { Route } from "./+types/home";
import { TextAnimation } from "~/components/waffle/logo/text-animation";
import { ClientOnly } from "remix-utils/client-only";
import { CircleButton } from "~/components/waffle/button/circle-button";
import { TextStaticAnimation } from "~/components/waffle/logo/text-static-animation";
import { ArrowLink, BackLink } from "~/components/waffle/button/arrow-button";
import { WebGLCanvas } from "~/components/waffle/three";
import { LogoAnimation } from "~/components/waffle/logo/logo-animation";
import { GradientBG } from "~/components/waffle/gradient-bg";
import { Button } from "~/components/shadcn/button";
import { cn } from "~/utils/cn";

import { FeaturesBanner, FeaturesText } from "./landing/features";
import { LogoAnimationNoRepeat } from "~/components/waffle/logo/logo-animation-no-repeat";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Waffle" }, { name: "description", content: "Welcome to Waffle!" }];
}

export default function Home() {
  return (
    <>
      <GradientBG className="absolute h-96 -top-24 right-20 blur-lg" />

      <div className="px-[20px] lg:px-[50px] mt-32 h-[90vh] flex flex-col">
        <TextAnimation className="h-max" />
        <div
          className={cn(
            "h-full flex flex-col items-center justify-center gap-12",
            "rounded-2xl backdrop-blur-[100px]"
          )}
        >
          <div className="flex flex-col gap-6 items-center">
            <p className="text-7xl text-yelight-dark">Reputation that Sticks.</p>
            <p className="text-3xl w-3/4 text-center text-gray-dark">
              Start building your decentralized credibility. Backed by the community, not
              algorithms.
            </p>
          </div>
          <Button>haloo</Button>
        </div>
      </div>

      <div className="px-[20px] lg:px-[50px] h-screen relative grid grid-cols-3 gap-x-12 items-center">
        <GradientBG className="absolute h-3/5 -left-96 blur-lg" />
        <p className="text-8xl text-yelight-dark">
          Own Your Reputation in
          <span className="bg-linear-170 from-[#EB701F] to-[#F2DB34] bg-clip-text text-transparent">
            Web3
          </span>
        </p>
        <div className="flex justify-center relative">
          <FeaturesBanner />
          <p className="text-gray-dark rounded-lg backdrop-blur-lg bg-linear-170 from-[#FFF7F1] via-[#FFF7F1] to-[#FFDD86] h-max w-max px-8 py-4 absolute top-[55%]">
            "Awesome People"
          </p>
          <p className="text-gray-dark rounded-lg backdrop-blur-lg bg-linear-170 from-[#FFF7F1] via-[#FFF7F1] to-[#FFDD86] h-max w-max px-8 py-4 absolute top-[70%] left-[20%]">
            "Awesome People"
          </p>
          <p className="text-gray-dark rounded-lg backdrop-blur-lg bg-linear-170 from-[#FFF7F1] via-[#FFF7F1] to-[#FFDD86] h-max w-max px-8 py-4 absolute top-[85%] left-0">
            "Awesome People"
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <FeaturesText />
        </div>
      </div>

      <div className="px-[20px] lg:px-[50px] relative grid grid-cols-2">
        <GradientBG className="absolute h-96 -left-40 blur-lg" />
        <div className="flex flex-col items-center justify-center gap-16">
          <div className="flex flex-col items-center gap-6 rounded-lg backdrop-blur-lg bg-linear-170 from-[#FFF7F1] via-[#FFF7F1] to-[#FFDD86] h-max w-1/2 px-8 py-4">
            <img src="/icons/users.svg" alt="builda reputation" className="size-24" />
            <p className="text-gray-dark text-xl">Build a reputation that you own</p>
          </div>
          <div className="flex flex-col items-center gap-6 rounded-lg backdrop-blur-lg bg-linear-170 from-[#FFF7F1] via-[#FFF7F1] to-[#FFDD86] h-max w-1/2 px-8 py-4">
            <img src="/icons/trust.svg" alt="builda reputation" className="size-24" />
            <p className="text-gray-dark text-xl">Let community trust be your portfolio</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-16">
          <LogoAnimationNoRepeat className="h-1/2" />
          <p className="text-6xl text-gray-dark font-semibold">
            Why{" "}
            <span className="bg-linear-170 from-[#EB701F] to-[#F2DB34] bg-clip-text text-transparent">
              Waffle?
            </span>
          </p>
        </div>
      </div>

      <div className="h-screen"></div>
      <div className="h-screen"></div>
      <div className="h-screen"></div>
      <div className="h-screen"></div>
      <div className="h-screen"></div>
      <div className="h-screen"></div>
    </>
  );
}
