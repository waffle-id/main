import { useRef, type JSX } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const lettersAndSymbols = [
  ..."abcdefghijklmnopqrstuvwxyz",
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "-",
  "_",
  "+",
  "=",
  ";",
  ":",
  "<",
  ">",
  ",",
];

type CommandLineTypoProps = JSX.IntrinsicElements["p"] & { scrollTrigger?: boolean };

export function CommandLineTypo({
  children,
  className,
  scrollTrigger = true,
}: CommandLineTypoProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const originalChars = useRef<string[]>([]);
  const chars = useRef<HTMLElement[]>([]);
  const splitter = useRef<SplitType | null>(null);

  function splitText() {
    if (!textRef.current) return;
    splitter.current = new SplitType(textRef.current, { types: "words,chars" });
    chars.current = splitter.current.chars ?? [];
    originalChars.current = chars.current.map((c) => c.innerHTML);
  }

  function animate() {
    if (!textRef.current || !chars.current.length) return;

    chars.current.forEach((char, i) => {
      const initialHTML = char.innerHTML;

      gsap.fromTo(
        char,
        { opacity: 0 },
        {
          duration: 0.03,
          onComplete: () => {
            gsap.set(char, { innerHTML: initialHTML, delay: 0.1 });
          },
          repeat: 2,
          repeatRefresh: true,
          repeatDelay: 0.05,
          delay: (i + 1) * 0.06,
          innerHTML: () => lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)],
          opacity: 1,
        }
      );
    });

    gsap.fromTo(textRef.current, { "--anim": 0 } as gsap.TweenVars, {
      duration: 1,
      ease: "expo",
      "--anim": 1,
    });
  }

  useGSAP(() => {
    let trigger;
    // gsap.registerPlugin(ScrollTrigger);

    if (!textRef.current) return;

    splitText();

    if (scrollTrigger) {
      trigger = ScrollTrigger.create({
        trigger: textRef.current,
        // start: "top 50%",
        // end: "top top",
        start: "top 70%",
        end: "bottom 90%",
        // markers: true,
        onEnter: animate,
      });
    } else {
      trigger = ScrollTrigger.create({
        trigger: textRef.current,
        start: "top bottom",
        end: "+=1",
        // markers: true,
        onEnter: animate,
      });
    }

    return () => {
      trigger.kill();
      splitter.current?.revert();
    };
  });

  return (
    <span ref={textRef} className={className}>
      {children}
    </span>
  );
}
