import { ArrowLink } from "~/components/waffle/button/arrow-button";
import { CircleButton } from "~/components/waffle/button/circle-button";
import { TextAnimation } from "~/components/waffle/logo/text-animation";
import { TextStaticAnimation } from "~/components/waffle/logo/text-static-animation";

export default function Docs() {
  return (
    <div className="flex flex-col gap-44 container">
      <div
        id="content"
        className="relative px-[20px] lg:px-[50px] py-[25px] lg:h-screen lg:grid lg:grid-rows-[1fr_auto]"
      >
        <div className="mt-[100px] lg:mt-0 grid lg:grid-cols-3 items-end self-end mb-10">
          <div className="text-[20px] lg:max-w-[345px]">
            <p>Cupcake ipsum dolor sit amet</p>
            <p>Cupcake dolor</p>
          </div>
          <p className="hidden relative lg:block justify-self-center italic">(scroll down)</p>
        </div>
        <TextAnimation />
      </div>

      <div className="flex flex-col gap-4">
        <p className="italic text-sm underline">Arrow Button</p>
        <ArrowLink to="#">Go to something else</ArrowLink>
      </div>

      <div className="flex flex-col gap-4">
        <p className="italic text-sm underline">Circle Button</p>
        <CircleButton text="Something" />
      </div>

      <div className="flex flex-col gap-4">
        <p className="italic text-sm underline">Text Static Animation (make it shorter animate)</p>
        <div className="flex w-max">
          <TextStaticAnimation className="h-24" />
        </div>
      </div>

      {/* <div className="flex flex-col gap-4 h-screen items-center justify-center">
        <p className="italic text-sm underline">Text Animation</p>
        <div className="flex w-max">
          <TextAnimation />
        </div>
      </div> */}

      <div className="h-screen" />
    </div>
  );
}
