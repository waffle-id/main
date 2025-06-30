import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { cn } from "~/utils/cn";

type Animatable = {
  previous: number;
  current: number;
  amt: number;
};

type AnimatableProps = {
  tx: Animatable;
  ty: Animatable;
  rotation: Animatable;
  brightness: Animatable;
};

interface HoverImageRevealProps {
  review: string;
  // img: string;
  animatableProperties: AnimatableProps;
  children: React.ReactNode;
  parentClassName?: string;
  childrenClassName?: string;
  parentStyle?: Record<string, string | number>;
  // childrenStyle?: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;
const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);

export function ImageHoverRevealText({
  review,
  // img,
  animatableProperties,
  children,
  parentClassName,
  childrenClassName,
  parentStyle,
}: // childrenStyle
HoverImageRevealProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const revealInnerRef = useRef<HTMLDivElement>(null);
  const revealImgRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef<number>(0);
  const mouseAreaRef = useRef<"up" | "down">("down");
  const firstRAF = useRef(true);
  const lastMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });

  const calcBounds = () => {
    const el = elRef.current;
    const reveal = revealRef.current;
    if (!el || !reveal) return null;
    return {
      el: el.getBoundingClientRect(),
      reveal: reveal.getBoundingClientRect(),
    };
  };

  const getMouseArea = (bounds: DOMRect) =>
    bounds.top + bounds.height / 2 <= window.innerHeight / 2 ? "up" : "down";

  const animateRevealIn = () => {
    gsap.killTweensOf([revealInnerRef.current, revealImgRef.current]);
    gsap
      .timeline({
        onStart: () => {
          if (revealRef.current) revealRef.current.style.opacity = "1";
          if (revealInnerRef.current) {
            revealInnerRef.current.style.opacity = "1";
            revealInnerRef.current.style.zIndex = "1000000";
          }
          gsap.set(elRef.current, { zIndex: 120 });
        },
      })
      .to(revealInnerRef.current, {
        scale: 1,
        ease: "expo.out",
        startAt: { scale: 0.6 },
        duration: 0.6,
      })
      .to(
        revealImgRef.current,
        {
          scale: 1,
          ease: "expo.out",
          startAt: { scale: 1.4 },
          duration: 0.6,
        },
        0
      );
  };

  const animateRevealOut = () => {
    gsap.killTweensOf([revealInnerRef.current, revealImgRef.current]);
    gsap
      .timeline({
        onStart: () => {
          gsap.set(elRef.current, { zIndex: 1 });
        },
        onComplete: () => {
          gsap.set(revealRef.current, { opacity: 0 });
        },
      })
      .to(revealInnerRef.current, {
        scale: 0.6,
        opacity: 0,
        duration: 0.4,
        ease: "expo.out",
      })
      .to(
        revealImgRef.current,
        {
          scale: 1.4,
          duration: 0.4,
          ease: "expo.out",
        },
        0
      );
  };

  const render = useCallback(() => {
    const bounds = calcBounds();
    if (!bounds) return;

    const mouse = { x: lastMouse.current.x, y: lastMouse.current.y };
    const diffX = Math.abs(velocity.current.x - mouse.x);
    const t = clamp(diffX, 0, 100);

    velocity.current = { ...mouse };

    animatableProperties.tx.current = Math.abs(mouse.x - bounds.el.left) - bounds.reveal.width / 2;
    animatableProperties.ty.current = Math.abs(mouse.y - bounds.el.top) - bounds.reveal.height / 2;
    animatableProperties.rotation.current = firstRAF.current
      ? 0
      : mapRange(
          t,
          0,
          175,
          0,
          velocity.current.x < 0
            ? mouseAreaRef.current === "up"
              ? 60
              : -60
            : mouseAreaRef.current === "up"
            ? -60
            : 60
        );
    animatableProperties.brightness.current = firstRAF.current ? 1 : mapRange(t, 0, 100, 1, 8);

    animatableProperties.tx.previous = firstRAF.current
      ? animatableProperties.tx.current
      : lerp(
          animatableProperties.tx.previous,
          animatableProperties.tx.current,
          animatableProperties.tx.amt
        );
    animatableProperties.ty.previous = firstRAF.current
      ? animatableProperties.ty.current
      : lerp(
          animatableProperties.ty.previous,
          animatableProperties.ty.current,
          animatableProperties.ty.amt
        );
    animatableProperties.rotation.previous = firstRAF.current
      ? animatableProperties.rotation.current
      : lerp(
          animatableProperties.rotation.previous,
          animatableProperties.rotation.current,
          animatableProperties.rotation.amt
        );
    animatableProperties.brightness.previous = firstRAF.current
      ? animatableProperties.brightness.current
      : lerp(
          animatableProperties.brightness.previous,
          animatableProperties.brightness.current,
          animatableProperties.brightness.amt
        );

    gsap.set(revealRef.current, {
      x: animatableProperties.tx.previous,
      y: animatableProperties.ty.previous,
      rotation: animatableProperties.rotation.previous,
      // filter: `brightness(${animatableProperties.brightness.previous})`,
    });

    firstRAF.current = false;
    requestIdRef.current = requestAnimationFrame(render);
  }, [animatableProperties]);

  const handleMouseEnter = () => {
    animateRevealIn();
    const bounds = calcBounds();
    if (bounds) mouseAreaRef.current = getMouseArea(bounds.el);
    firstRAF.current = true;
    requestIdRef.current = requestAnimationFrame(render);
  };

  const handleMouseLeave = () => {
    cancelAnimationFrame(requestIdRef.current!);
    animateRevealOut();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestIdRef.current!);
    };
  }, [render]);

  return (
    <div
      ref={elRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative inline-block grayscale-100 hover:grayscale-0"
      style={parentStyle}
    >
      <div className={cn("pointer-events-none", parentClassName)}>{children}</div>
      <div
        ref={revealRef}
        className="absolute top-0 left-0 pointer-events-none"
        style={{ opacity: 0 }}
      >
        <div ref={revealInnerRef}>
          <div
            ref={revealImgRef}
            className={cn(
              "bg-black text-white p-8 rounded-md shadow-lg text-sm flex items-center justify-center w-[25vh] h-full",
              childrenClassName
            )}
          >
            {review}
          </div>
        </div>
      </div>
    </div>
  );
}
