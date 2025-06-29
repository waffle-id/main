import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";
import { cn } from "~/utils/cn";

const imageItems = [
  { src: "https://placehold.co/6", r: 1, c: 4, review: "Lorem 1" },
  { src: "https://placehold.co/20", r: 1, c: 1, review: "Lorem 2" },
  { src: "https://placehold.co/2", r: 2, c: 8, review: "Lorem 3" },
  { src: "https://placehold.co/19", r: 2, c: 5, review: "Lorem 4" },
  { src: "https://placehold.co/3", r: 3, c: 3, review: "Lorem 5" },
  { src: "https://placehold.co/4", r: 4, c: 7, review: "Lorem 6" },
  { src: "https://placehold.co/5", r: 5, c: 8, review: "Lorem 7" },
  { src: "https://placehold.co/1", r: 6, c: 2, review: "Lorem 8" },
  { src: "https://placehold.co/7", r: 7, c: 3, review: "Lorem 9" },
  { src: "https://placehold.co/8", r: 8, c: 7, review: "Lorem 10" },
  { src: "https://placehold.co/9", r: 9, c: 1, review: "Lorem 11" },
  { src: "https://placehold.co/18", r: 9, c: 6, review: "Lorem 12" },
  { src: "https://placehold.co/10", r: 10, c: 4, review: "Lorem 13" },
  // { src: "https://placehold.co/11", r: 11, c: 2, review: "Lorem 14" },
];

export default function Profile() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    if (!gridRef.current) return;

    const items = gridRef.current.querySelectorAll(".grid-item");
    items.forEach((item) => {
      const img = item.querySelector(".grid-item-img");
      if (!img) return;

      const yPercentRandomVal = gsap.utils.random(-100, 100);

      gsap
        .timeline()
        .addLabel("start", 0)
        .to(
          item,
          {
            ease: "none",
            borderRadius: "50%",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              end: "top top",
              scrub: true,
            },
          },
          "start"
        )
        .to(
          item,
          {
            ease: "none",
            yPercent: yPercentRandomVal,
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          },
          "start"
        );
    });
  }, []);

  /* ---------------------------------- hover --------------------------------- */
  const textSelectedRef = useRef<HTMLDivElement[]>([]);
  const profileHoverSelected = useRef<HTMLSpanElement[]>([]);

  useGSAP(() => {
    textSelectedRef.current.forEach((img) => {
      gsap.set(img, {
        xPercent: -50,
        yPercent: -50,
        opacity: 0,
        position: "fixed",
        top: 0,
        left: 0,
        visibility: "hidden",
        pointerEvents: "none",
        zIndex: 50,
      });
    });

    profileHoverSelected.current.forEach((el, index) => {
      const imageEl = textSelectedRef.current[index];

      if (!el || !imageEl) return;

      const setX = gsap.quickSetter(imageEl, "x", "px");
      const setY = gsap.quickSetter(imageEl, "y", "px");

      const align = (e: MouseEvent) => {
        setX(e.clientX);
        setY(e.clientY);
      };

      const startFollow = () => document.addEventListener("mousemove", align);
      const stopFollow = () => document.removeEventListener("mousemove", align);

      const fade = gsap.to(imageEl, {
        autoAlpha: 1,
        duration: 0.25,
        ease: "power2.out",
        paused: true,
        onReverseComplete: stopFollow,
      });

      const handleMouseEnter = (e: MouseEvent) => {
        console.log("mouse enter");
        fade.play();
        startFollow();
        align(e);

        const allSpans = document.querySelectorAll(".profile div");
        allSpans.forEach((span) => {
          (span as HTMLElement).style.opacity = span === el ? "1" : "0.75";
        });
      };

      const handleMouseLeave = () => {
        fade.reverse();
        const allSpans = document.querySelectorAll(".profile div");
        allSpans.forEach((span) => {
          (span as HTMLElement).style.opacity = "1";
        });
      };

      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
        stopFollow();
      };
    });
  });

  return (
    <main className="relative">
      {/* Cover */}
      <div className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center pointer-events-none z-50">
        {/* <div className=" flex flex-col gap-4 items-center backdrop-blur-lg rounded-lg p-4"> */}
        <h2 className="text-[8vw] font-bold font-sans m-0">
          Hawwooo<sup className="text-[4vw] font-bold align-super">&reg;</sup>
        </h2>
        <h3 className="text-xl font-normal m-0">lorem~</h3>
        {/* </div> */}
      </div>

      {imageItems.map((val, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) textSelectedRef.current[i] = el;
          }}
          className="fixed top-0 left-0 invisible opacity-0 pointer-events-none w-1/4 z-50"
        >
          {/* <img src={src} alt={`hover-${i}`} className="w-full h-auto object-cover rounded" /> */}
          <p
            className={cn(
              "w-full h-auto rounded bg-white text-black p-6 px-4 absolute -top-2",
              val.c > 7 && "right-52 ",
              val.c < 3 && "left-52"
            )}
          >
            {val.c}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto corporis, quia
            reprehenderit cupiditate rerum fugit deleniti maxime deserunt amet pariatur officia,
            consectetur ipsum, magni recusandae cumque incidunt numquam itaque debitis?
          </p>
        </div>
      ))}

      {/* Grid */}
      <div className="relative z-0 w-full min-h-screen">
        <div ref={gridRef} className="grid grid-cols-8 auto-rows-[1fr] gap-2 w-full">
          {(() => {
            let hoverIndex = 0;

            return imageItems.map(({ src, r, c }, i) => {
              const currentHoverIndex = hoverIndex;
              hoverIndex++;
              return (
                <div
                  key={i}
                  ref={(el) => {
                    if (el) profileHoverSelected.current[currentHoverIndex] = el;
                  }}
                  className="profile grid-item relative"
                  style={
                    {
                      gridRow: r,
                      gridColumn: c,
                    } as React.CSSProperties
                  }
                >
                  <div
                    className="grid-item-img w-full aspect-square bg-cover bg-center"
                    style={{ backgroundImage: `url(${src})` }}
                  />
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-[10000] h-screen bg-gray-200 text-black text-[5vh] flex items-center justify-center px-4">
        <p className="max-w-[40ch] leading-snug">
          From the dawn of civilisation onwards crowds have always undergone the influence of
          illusions. It is to the creators of illusions that they have raised more temples, statues,
          and altars than to any other class of men.
        </p>
      </div>
    </main>
  );
}
