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

    // console.log("gsap", gsap);

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

    // Gentle floating animation
    // letters.forEach((letter, index) => {
    //   // Create a continuous wave-like motion
    //   tl.to(letter, {
    //     y: index % 2 === 0 ? 10 : -10,
    //     rotation: index % 2 === 0 ? 10 : -10,
    //     duration: 0.7,
    //     ease: "sine.inOut",
    //   });

    //   tl.to(letter, {
    //     y: 0,
    //     rotation: 0,
    //     duration: 1.2,
    //     ease: "sine.inOut",
    //   });
    // });

    // tl.to(
    //   letters,
    //   {
    //     scale: 0.95,
    //     duration: 0.8,
    //     ease: "sine.inOut",
    //   },
    //   "+=0.2"
    // );

    // tl.to(letters, {
    //   scale: 1,
    //   duration: 0.8,
    //   ease: "sine.inOut",
    // });

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

    // Slight scale pulse at the end of the animation to transition smoothly back to the beginning
    // tl.to(
    //   letters,
    //   {
    //     scale: 0.95,
    //     duration: 0.8,
    //     ease: "sine.inOut",
    //   },
    //   "+=0.2"
    // );

    // tl.to(letters, {
    //   scale: 1,
    //   duration: 0.8,
    //   ease: "sine.inOut",
    // });

    // Reset colors to original for smooth looping
    tl.to(w, { fill: "#fff", duration: 0.5 }, "-=0.5");
    tl.to(a, { fill: "#fff", duration: 0.5 }, "-=0.5");
    tl.to(f1, { fill: "#fff", duration: 0.5 }, "-=0.5");
    tl.to(f2, { fill: "#fff", duration: 0.5 }, "-=0.5");
    tl.to(l, { fill: "#fff", duration: 0.5 }, "-=0.5");
    tl.to(e, { fill: "#fff", duration: 0.5 }, "-=0.5");

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
        id="static-w"
        d="M 20.4 68.001 Q 21.3 68.001 26.9 49.001 Q 32.5 30.001 33.1 28.601 Q 34.5 25.001 37.55 25.001 Q 40.6 25.001 41.8 28.501 Q 42.9 31.901 44.8 39.001 Q 46.7 46.101 47.6 49.201 Q 53.1 68.001 54.05 68.001 Q 55 68.001 60.6 49.301 Q 61.9 45.001 63.9 37.601 Q 65.9 30.201 66.3 28.901 Q 67.5 25.001 70 25.001 Q 71.5 25.001 72.55 25.901 Q 73.6 26.801 73.6 28.051 Q 73.6 29.301 73.35 30.351 Q 73.1 31.401 72.45 33.351 Q 71.8 35.301 71.1 37.501 Q 70.4 39.701 69.05 43.651 Q 67.7 47.601 64.4 58.001 Q 61.1 68.401 59.2 73.201 Q 57.7 77.001 53.7 77.001 Q 49.7 77.001 47.9 71.801 Q 44.3 61.401 41 49.851 Q 37.7 38.301 36.9 38.301 Q 36.2 38.301 35.05 42.251 Q 33.9 46.201 33.25 48.451 Q 32.6 50.701 32.4 51.501 Q 27.1 69.901 25.2 73.501 Q 23.5 77.001 19.7 77.001 Q 15.9 77.001 14 71.501 Q 13.3 69.501 11.15 62.901 Q 9 56.301 7.65 52.251 Q 6.3 48.201 4.95 44.401 Q 3.6 40.601 2.8 38.401 Q 2 36.201 1.3 34.101 Q 0 30.201 0 28.601 Q 0 27.001 1.05 26.001 Q 2.1 25.001 3.6 25.001 Q 6.5 25.001 7.6 28.501 Q 8 29.701 10.25 37.251 Q 12.5 44.801 13.45 47.851 Q 14.4 50.901 15.4 54.101 Q 16.4 57.301 17.05 59.301 Q 17.7 61.301 18.5 63.601 Q 19.9 68.001 20.4 68.001 Z"
        fill="#FFF"
      />
      <path
        id="static-a"
        d="M 122.8 51.801 Q 122.8 59.301 123.9 64.051 Q 125 68.801 126.5 69.401 Q 127.1 69.701 127.95 69.801 Q 128.8 69.901 129.15 70.101 Q 129.5 70.301 129.5 70.901 Q 129.5 73.601 128.05 75.301 Q 126.6 77.001 123.7 77.001 Q 120.8 77.001 119.2 73.301 Q 117.6 69.601 117.6 63.801 Q 115.1 69.401 110.25 73.201 Q 105.4 77.001 99.35 77.001 Q 93.3 77.001 88.9 73.001 Q 80.9 65.701 80.9 52.101 Q 80.9 41.201 87.2 33.101 Q 93.5 25.001 103.4 25.001 Q 110.9 25.001 116.4 30.101 Q 116.4 25.001 120.2 25.001 Q 124.8 25.001 124.8 32.051 Q 124.8 39.101 122.8 51.801 Z M 117 52.701 L 116.5 37.301 Q 110.5 31.501 103.95 31.501 Q 97.4 31.501 92.7 37.401 Q 88 43.301 88 51.551 Q 88 59.801 91.05 65.151 Q 94.1 70.501 99.7 70.501 Q 105.3 70.501 109.9 65.501 Q 114.5 60.501 117 52.701 Z"
        fill="#FFF"
      />
      <path
        id="static-f1"
        d="M 150.7 18.401 L 150.7 26.001 L 160.4 25.801 Q 162 25.801 163.1 26.601 Q 164.2 27.401 164.2 29.001 Q 164.2 32.001 160.4 32.001 L 150.7 31.801 L 150.7 38.501 Q 150.7 52.301 151 61.701 Q 151.3 71.101 151.3 72.651 Q 151.3 74.201 150.25 75.601 Q 149.2 77.001 147.4 77.001 Q 145.6 77.001 144.55 75.601 Q 143.5 74.201 143.5 72.651 Q 143.5 71.101 143.6 66.401 Q 144.1 52.301 144.1 38.501 L 144.1 31.801 L 139 32.001 Q 135.2 32.001 135.2 29.001 Q 135.2 27.401 136.3 26.601 Q 137.4 25.801 139 25.801 L 144 26.001 L 144 17.501 Q 144 8.201 147.65 4.101 Q 151.3 0.001 156.1 0.001 Q 160.9 0.001 164.05 1.851 Q 167.2 3.701 167.2 5.801 Q 167.2 9.101 164.4 9.101 Q 163.1 9.101 161 7.901 Q 158.9 6.701 156.9 6.701 Q 150.7 6.701 150.7 18.401 Z"
        fill="#FFF"
      />
      <path
        id="static-f2"
        d="M 183.4 18.401 L 183.4 26.001 L 193.1 25.801 Q 194.7 25.801 195.8 26.601 Q 196.9 27.401 196.9 29.001 Q 196.9 32.001 193.1 32.001 L 183.4 31.801 L 183.4 38.501 Q 183.4 52.301 183.7 61.701 Q 184 71.101 184 72.651 Q 184 74.201 182.95 75.601 Q 181.9 77.001 180.1 77.001 Q 178.3 77.001 177.25 75.601 Q 176.2 74.201 176.2 72.651 Q 176.2 71.101 176.3 66.401 Q 176.8 52.301 176.8 38.501 L 176.8 31.801 L 171.7 32.001 Q 167.9 32.001 167.9 29.001 Q 167.9 27.401 169 26.601 Q 170.1 25.801 171.7 25.801 L 176.7 26.001 L 176.7 17.501 Q 176.7 8.201 180.35 4.101 Q 184 0.001 188.8 0.001 Q 193.6 0.001 196.75 1.851 Q 199.9 3.701 199.9 5.801 Q 199.9 9.101 197.1 9.101 Q 195.8 9.101 193.7 7.901 Q 191.6 6.701 189.6 6.701 Q 183.4 6.701 183.4 18.401 Z"
        fill="#FFF"
      />
      <path
        id="static-l"
        d="M 213.6 5.001 L 213.1 38.501 L 213.6 72.001 Q 213.6 77.001 209.8 77.001 Q 206 77.001 206 72.001 L 206.5 38.501 L 206 5.001 Q 206 0.001 209.8 0.001 Q 213.6 0.001 213.6 5.001 Z"
        fill="#FFF"
      />
      <path
        id="static-e"
        d="M 251.85 24.501 Q 259.9 24.501 264.95 29.001 Q 270 33.501 270 40.701 Q 270 47.901 263.75 51.651 Q 257.5 55.401 248.4 55.401 Q 243.2 55.401 235.7 53.901 Q 236.3 60.901 240.95 65.951 Q 245.6 71.001 251.3 71.001 Q 254.7 71.001 257.6 70.051 Q 260.5 69.101 262 68.001 Q 266 64.901 267.25 64.901 Q 268.5 64.901 269.25 65.651 Q 270 66.401 270 67.501 Q 270 70.301 264.25 73.901 Q 258.5 77.501 251.8 77.501 Q 241.4 77.501 235.3 70.201 Q 229.2 62.901 228.7 52.601 Q 223.4 51.001 223.4 47.401 Q 223.4 45.901 224.25 45.051 Q 225.1 44.201 226.3 44.201 Q 227.5 44.201 229.3 45.101 Q 231.5 36.101 237.65 30.301 Q 243.8 24.501 251.85 24.501 Z M 248.05 49.101 Q 254.8 49.101 258.85 46.801 Q 262.9 44.501 262.9 40.601 Q 262.9 36.701 260.25 33.851 Q 257.6 31.001 252.7 31.001 Q 246.1 31.001 241.6 35.951 Q 237.1 40.901 235.8 47.501 Q 241.3 49.101 248.05 49.101 Z"
        fill="#FFF"
      />
    </svg>
  );
}
