import { ArrowLink } from "~/components/waffle/button/arrow-button";
import { CircleButton } from "~/components/waffle/button/circle-button";
import { ImageHoverRevealText } from "~/components/waffle/image-hover-reveal-text";
import { TextAnimation } from "~/components/waffle/logo/text-animation";
import { TextStaticAnimation } from "~/components/waffle/logo/text-static-animation";
import { TextHoverRevealImage } from "~/components/waffle/text-hover-reveal-image";

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

      <div className="flex flex-col gap-4">
        <p className="italic text-sm underline">hawo</p>
        <div className="flex w-max">
          <TextHoverRevealImage
            img="https://placehold.co/150"
            animatableProperties={{
              tx: { current: 0, previous: 0, amt: 0.1 },
              ty: { current: 0, previous: 0, amt: 0.1 },
              rotation: { current: 0, previous: 0, amt: 0.1 },
              brightness: { current: 1, previous: 1, amt: 0.08 },
            }}
          >
            <p>Lorem ipsum dolor sit amet</p>
          </TextHoverRevealImage>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="italic text-sm underline">hawo</p>
        <div className="flex w-max">
          <ImageHoverRevealText
            review="Lorem ipsum dolor sit amet"
            animatableProperties={{
              tx: { current: 0, previous: 0, amt: 0.1 },
              ty: { current: 0, previous: 0, amt: 0.1 },
              rotation: { current: 0, previous: 0, amt: 0.1 },
              brightness: { current: 1, previous: 1, amt: 0.08 },
            }}
          >
            <div className="relative aspect-square w-full">
              {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div> */}
              <img
                src="https://placehold.co/150"
                alt=""
                className="grid-item-img relative aspect-square w-full p-2 rounded-full"
              />
            </div>
          </ImageHoverRevealText>
        </div>
      </div>

      <div className="h-screen" />
    </div>
  );
}
