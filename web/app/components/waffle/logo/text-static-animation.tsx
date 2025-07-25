import { useEffect, useRef, type JSX } from "react";
import gsap from "gsap";
import { cn } from "~/utils/cn";

export function TextStaticAnimation({ className }: JSX.IntrinsicElements["svg"]) {
  const svgRef = useRef<SVGSVGElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear any existing animations
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const svg = svgRef.current;
    const w = svg.querySelector("#static-w");
    const a = svg.querySelector("#static-a");
    const f1 = svg.querySelector("#static-f1");
    const f2 = svg.querySelector("#static-f2");
    const l = svg.querySelector("#static-l");
    const e = svg.querySelector("#static-e");

    const letters = [w, a, f1, f2, l, e];

    // Create a main timeline
    const tl = gsap.timeline({
      repeat: -1, // -1 means infinite loop
      defaults: {
        ease: "power2.inOut",
        duration: 0.7,
      },
    });

    timelineRef.current = tl;

    // Instead of hiding letters initially, we'll create a continuous animation
    // First, set up the initial state where all letters are visible
    gsap.set(letters, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotation: 0,
    });

    // Bounce effect
    tl.add("bounce", "+=0.5");

    // Have all letters bounce together
    tl.to(
      letters,
      {
        y: -15,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.08,
      },
      "bounce"
    );

    tl.to(
      letters,
      {
        y: 0,
        duration: 0.6,
        ease: "bounce.out",
        stagger: 0.08,
      },
      "bounce+=0.6"
    );

    // Reset colors to original for smooth looping
    // tl.to(w, { fill: "#fff", duration: 0.5 }, "-=0.5");
    // tl.to(a, { fill: "#fff", duration: 0.5 }, "-=0.5");
    // tl.to(f1, { fill: "#fff", duration: 0.5 }, "-=0.5");
    // tl.to(f2, { fill: "#fff", duration: 0.5 }, "-=0.5");
    // tl.to(l, { fill: "#fff", duration: 0.5 }, "-=0.5");
    // tl.to(e, { fill: "#fff", duration: 0.5 }, "-=0.5");

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  });

  return (
    <svg
      ref={svgRef}
      className={cn("h-12 aspect-video overflow-visible object-center", className)}
      viewBox="0 0 272.002 84.502"
    >
      <path
        d="M 19.2 70.1 Q 13.3 70.1 9 67 Q 4.7 63.9 2.35 58.35 Q 0 52.8 0 45.5 Q 0 41.9 0.65 37.95 Q 1.3 34 2.65 30.6 Q 4 27.2 6.25 25.05 Q 8.5 22.9 11.7 22.9 Q 15.5 22.9 17.45 25.35 Q 19.4 27.8 19.4 31.8 Q 19.4 33.6 18.85 36 Q 18.3 38.4 17.75 40.85 Q 17.2 43.3 17.2 45.3 Q 17.2 48.5 17.85 50.1 Q 18.5 51.7 20.8 51.7 Q 23.2 51.7 23.95 49.15 Q 24.7 46.6 24.65 42.55 Q 24.6 38.5 24.6 34.2 Q 24.6 31 26.35 28.45 Q 28.1 25.9 32.1 25.9 Q 36.2 25.9 38.05 28.45 Q 39.9 31 39.9 34.2 Q 39.9 38.5 39.75 42.55 Q 39.6 46.6 40.35 49.15 Q 41.1 51.7 43.8 51.7 Q 48.5 51.7 48.5 45.3 Q 48.5 43.3 47.75 40.85 Q 47 38.4 46.2 35.95 Q 45.4 33.5 45.4 31.6 Q 45.4 23 52.6 23 Q 55.8 23 58.05 25.1 Q 60.3 27.2 61.65 30.6 Q 63 34 63.65 37.9 Q 64.3 41.8 64.3 45.4 Q 64.3 56.5 59.15 63.15 Q 54 69.8 45.1 69.8 Q 41.1 69.8 37.7 68.25 Q 34.3 66.7 32.1 64.2 Q 29.9 66.7 26.6 68.4 Q 23.3 70.1 19.2 70.1 Z"
        id="static-w"
        fill="#fdba0f"
      />
      <path
        d="M 85.3 70 Q 80.4 70 76.35 68.5 Q 72.3 67 69.9 63.95 Q 67.5 60.9 67.5 56.2 Q 67.5 52.2 69.9 49.4 Q 72.3 46.6 76.35 45.1 Q 80.4 43.6 85.3 43.6 Q 88.2 43.6 90.6 44.05 Q 93 44.5 93.9 45.1 Q 93.9 42.8 92 41.05 Q 90.1 39.3 85.4 39.3 Q 83.2 39.3 81.95 39.65 Q 80.7 40 79.7 40.5 Q 78.7 41 77.45 41.35 Q 76.2 41.7 74.1 41.7 Q 71 41.7 69.15 40.05 Q 67.3 38.4 67.3 35 Q 67.3 31.9 69.05 29.65 Q 70.8 27.4 73.6 25.9 Q 76.4 24.4 79.65 23.7 Q 82.9 23 85.9 23 Q 94.8 23 100.4 26.25 Q 106 29.5 108.7 34.7 Q 111.4 39.9 111.4 46 Q 111.4 49.4 110.85 52.3 Q 110.3 55.2 109.4 56.8 Q 110.8 58 111.55 59.6 Q 112.3 61.2 112.3 62.9 Q 112.3 65.7 110.45 67.85 Q 108.6 70 105.2 70 Q 102.6 70 101.1 69.2 Q 99.6 68.4 98.1 67.1 Q 95.7 68.5 92.8 69.25 Q 89.9 70 85.3 70 Z M 87.3 59.9 Q 89.6 59.9 90.75 58.95 Q 91.9 58 91.9 56.8 Q 91.9 55.6 90.75 54.65 Q 89.6 53.7 87.3 53.7 Q 85.1 53.7 83.9 54.65 Q 82.7 55.6 82.7 56.8 Q 82.7 58 83.9 58.95 Q 85.1 59.9 87.3 59.9 Z"
        id="static-a"
        fill="#fdba0f"
      />
      <path
        d="M 138.2 69.8 Q 134.4 69.8 132.1 67.1 Q 129.8 64.4 128.65 59.65 Q 127.5 54.9 127.1 48.6 Q 121 48.1 117.65 46.2 Q 114.3 44.3 114.3 39.6 Q 114.3 34.9 117.65 32.95 Q 121 31 127.1 30.4 Q 127.6 21.5 129.85 14.6 Q 132.1 7.7 137.2 3.85 Q 142.3 0 151.5 0 Q 156.6 0 160.45 2.4 Q 164.3 4.8 164.3 9.9 Q 164.3 15.2 160.95 17.65 Q 157.6 20.1 152.9 21 Q 149.2 21.7 147.7 24.25 Q 146.2 26.8 145.8 30.2 Q 154.8 30.4 159.55 32.1 Q 164.3 33.8 164.3 39.6 Q 164.3 43.4 162.1 45.35 Q 159.9 47.3 155.75 48 Q 151.6 48.7 146 48.8 Q 146 52.8 146.1 56.05 Q 146.2 59.3 146.2 62 Q 146.2 65.2 144.9 66.9 Q 143.6 68.6 141.75 69.2 Q 139.9 69.8 138.2 69.8 Z"
        id="static-f1"
        fill="#fdba0f"
      />
      <path
        d="M 192.7 69.8 Q 188.9 69.8 186.6 67.1 Q 184.3 64.4 183.15 59.65 Q 182 54.9 181.6 48.6 Q 175.5 48.1 172.15 46.2 Q 168.8 44.3 168.8 39.6 Q 168.8 34.9 172.15 32.95 Q 175.5 31 181.6 30.4 Q 182.1 21.5 184.35 14.6 Q 186.6 7.7 191.7 3.85 Q 196.8 0 206 0 Q 211.1 0 214.95 2.4 Q 218.8 4.8 218.8 9.9 Q 218.8 15.2 215.45 17.65 Q 212.1 20.1 207.4 21 Q 203.7 21.7 202.2 24.25 Q 200.7 26.8 200.3 30.2 Q 209.3 30.4 214.05 32.1 Q 218.8 33.8 218.8 39.6 Q 218.8 43.4 216.6 45.35 Q 214.4 47.3 210.25 48 Q 206.1 48.7 200.5 48.8 Q 200.5 52.8 200.6 56.05 Q 200.7 59.3 200.7 62 Q 200.7 65.2 199.4 66.9 Q 198.1 68.6 196.25 69.2 Q 194.4 69.8 192.7 69.8 Z"
        id="static-f2"
        fill="#fdba0f"
      />
      <path
        d="M 235 69.8 Q 229.9 69.8 227.4 65.95 Q 224.9 62.1 224.1 54.35 Q 223.3 46.6 223.3 34.9 Q 223.3 27.2 223.55 20.8 Q 223.8 14.4 224.9 9.75 Q 226 5.1 228.4 2.55 Q 230.8 0 235.1 0 Q 239.4 0 241.8 2.55 Q 244.2 5.1 245.3 9.75 Q 246.4 14.4 246.65 20.8 Q 246.9 27.2 246.9 34.9 Q 246.9 52.5 244.45 61.15 Q 242 69.8 235 69.8 Z"
        id="static-l"
        fill="#fdba0f"
      />
      <path
        d="M 275 70 Q 267.5 70 261.85 67.05 Q 256.2 64.1 253.05 58.95 Q 249.9 53.8 249.9 47.1 Q 249.9 40.6 253.05 35.1 Q 256.2 29.6 261.75 26.3 Q 267.3 23 274.5 23 Q 281.2 23 286 25.7 Q 290.8 28.4 293.35 32.55 Q 295.9 36.7 295.9 41.3 Q 295.9 45.9 293.8 48.85 Q 291.7 51.8 288.35 53.35 Q 285 54.9 281.2 55.4 Q 277.4 55.9 273.9 55.55 Q 270.4 55.2 268 54.4 Q 269.8 57.3 272.55 58.35 Q 275.3 59.4 278.35 59.25 Q 281.4 59.1 283.9 58.6 Q 287 57.9 289 58.9 Q 291 59.9 291.1 62.1 Q 291.2 63.9 289.85 65.7 Q 288.5 67.5 285 68.75 Q 281.5 70 275 70 Z M 268.3 42.2 Q 269.3 43.8 271.2 44.45 Q 273.1 45.1 275.05 44.9 Q 277 44.7 278.35 43.8 Q 279.7 42.9 279.7 41.3 Q 279.7 39.6 278.35 38.25 Q 277 36.9 274.1 36.9 Q 271.3 36.9 269.8 38.65 Q 268.3 40.4 268.3 42.2 Z"
        id="static-e"
        fill="#fdba0f"
      />
    </svg>
  );
}
