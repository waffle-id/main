// import { RetroButton } from "~/components/waffle/retro-button";
import type { Route } from "./+types/home";
import { TextAnimation } from "~/components/waffle/logo/text-animation";
import { ClientOnly } from "remix-utils/client-only";
import { CircleButton } from "~/components/waffle/button/circle-button";
import { TextStaticAnimation } from "~/components/waffle/logo/text-static-animation";
import { ArrowLink, BackLink } from "~/components/waffle/button/arrow-button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <>
      <div className="flex p-10 m-5 border border-white rounded-lg h-screen">
        {/* <ClientOnly>{() => <TextAnimation />}</ClientOnly> */}
        {/* <CircleButton text="halooo"></CircleButton> */}
      </div>
      <div className="flex p-10 m-5 border border-white rounded-lg h-screen">
        <TextStaticAnimation />
        <ArrowLink to="/">Learn More</ArrowLink>
        <BackLink to="/">Learn More</BackLink>
      </div>
    </>
  );
}
