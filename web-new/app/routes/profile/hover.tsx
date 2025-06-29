import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const images = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2973&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1676218968741-8179dd7e533f?q=80&w=2970&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520038569969-98da7959fcbd?q=80&w=2971&auto=format&fit=crop",
];

const textParts = [
  { text: "Lorem ipsum", hover: false },
  { text: "dolor sit amet,", hover: true },
  { text: "consectetur adipiscing", hover: false },
  { text: "elit sed do cupcake ipsum dolor", hover: true },
  { text: "eiusmod tempor", hover: false },
  { text: "incididunt ut labore", hover: true },
];

export default function HoverImageText() {
  const hoverSelectedRef = useRef<HTMLDivElement[]>([]);
  const textSpanRefs = useRef<HTMLSpanElement[]>([]);

  useGSAP(() => {
    hoverSelectedRef.current.forEach((img) => {
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

    textSpanRefs.current.forEach((el, index) => {
      const imageEl = hoverSelectedRef.current[index];

      if (!el || !imageEl) return;

      const divEl = document.createElement("div");
      divEl.style.borderRadius = "20px";
      divEl.style.backgroundColor = "#fff";
      divEl.style.padding = "2rem";
      divEl.textContent = JSON.stringify(images[index]);

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

        const allSpans = document.querySelectorAll(".intro-text span");
        allSpans.forEach((span) => {
          (span as HTMLElement).style.opacity = span === el ? "1" : "0.25";
        });
      };

      const handleMouseLeave = () => {
        fade.reverse();
        const allSpans = document.querySelectorAll(".intro-text span");
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
    <>
      {/* Floating Images */}
      {images.map((src, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) hoverSelectedRef.current[i] = el;
          }}
          className="fixed top-0 left-0 invisible opacity-0 pointer-events-none w-1/4 z-50"
        >
          {/* <img src={src} alt={`hover-${i}`} className="w-full h-auto object-cover rounded" /> */}
          <p className="w-full h-auto rounded bg-white text-black p-6 px-4 absolute -top-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto corporis, quia
            reprehenderit cupiditate rerum fugit deleniti maxime deserunt amet pariatur officia,
            consectetur ipsum, magni recusandae cumque incidunt numquam itaque debitis?
          </p>
        </div>
      ))}

      {/* Text Section */}
      <div className="h-20 w-full" />
      <div className="px-10 py-16">
        <div className="intro-text flex flex-wrap gap-2 text-2xl font-bold">
          {(() => {
            let hoverIndex = 0;
            return textParts.map((part, i) => {
              if (part.hover) {
                const currentHoverIndex = hoverIndex;
                hoverIndex++; // increment BEFORE return
                return (
                  <span
                    key={i}
                    ref={(el) => {
                      if (el) textSpanRefs.current[currentHoverIndex] = el;
                    }}
                    className="transition-opacity duration-200 cursor-default"
                  >
                    {part.text}
                  </span>
                );
              }

              return (
                <span key={i} className="transition-opacity duration-200 cursor-default">
                  {part.text}
                </span>
              );
            });
          })()}
        </div>
      </div>
    </>
  );
}
