import { Link, type LinkProps } from "react-router";
import { motion, useReducedMotion, type Variant } from "framer-motion";
// import { Icon } from "./icon"
import { cn } from "~/utils/cn";
import { MoveUp } from "lucide-react";
import type { JSX } from "react";

/* -------------------------------------------------------------------------- */
/*                                    types                                   */
/* -------------------------------------------------------------------------- */
type ArrowIconProps = "up" | "down" | "left" | "right";
type ElementState = "active" | "focus" | "hover" | "initial";

// type ArrowButtonBaseProps = {
//   direction?: ArrowIconProps;
//   children?: React.ReactNode | React.ReactNode[];
//   className?: string;
// };

type ConditionalHrefAndTo =
  | { href?: string; to?: never; target?: JSX.IntrinsicElements["a"]["target"] }
  | { href?: never; to: LinkProps["to"]; target?: never };

type PrefetchType = { prefetch?: LinkProps["prefetch"] };

type ArrowLinkProps = ConditionalHrefAndTo &
  // ArrowButtonBaseProps &
  JSX.IntrinsicElements["div"] &
  PrefetchType & {
    direction?: ArrowIconProps;
  };

/* -------------------------------------------------------------------------- */
/*                               Motion variant                               */
/* -------------------------------------------------------------------------- */
const arrowVariants: Record<ArrowIconProps, Record<ElementState, Variant>> = {
  down: {
    initial: { y: 0 },
    hover: { y: 4 },
    focus: {
      y: [0, 4, 0],
      transition: { repeat: Infinity },
    },
    active: { y: 12 },
  },
  up: {
    initial: { y: 0 },
    hover: { y: -4 },
    focus: {
      y: [0, -4, 0],
      transition: { repeat: Infinity },
    },
    active: { y: -12 },
  },
  left: {
    initial: { x: 0 },
    hover: { x: -4 },
    focus: {
      x: [0, -4, 0],
      transition: { repeat: Infinity },
    },
    active: { x: -12 },
  },
  right: {
    initial: { x: 0 },
    hover: { x: 4 },
    focus: {
      x: [0, 4, 0],
      transition: { repeat: Infinity },
    },
    active: { x: 12 },
  },
  //   "top-right": {
  //     initial: { x: 0, y: 0 },
  //     hover: { x: 4, y: -4 },
  //     focus: {
  //       x: [0, 4, 0],
  //       y: [0, -4, 0],
  //       transition: { repeat: Infinity },
  //     },
  //     active: { x: 12, y: -12 },
  //   },
};

/* -------------------------------------------------------------------------- */
/*                                   helper                                   */
/* -------------------------------------------------------------------------- */
function getBaseClass(className: JSX.IntrinsicElements["div"]["className"]) {
  return cn(
    "text-primary inline-flex cursor-pointer items-center text-left font-medium transition focus:outline-none h-max",
    className
  );
}

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */
const MotionLink = motion.create(Link);

function ArrowButtonContent({ children, direction = "right" }: ArrowLinkProps) {
  const circumference = 28 * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {children && (direction === "right" || direction === "up") ? (
        <span className="mr-8 text-xl font-medium">{children}</span>
      ) : null}

      <div className="relative inline-flex h-14 w-14 flex-none items-center justify-center p-1">
        <div className="absolute text-white/20">
          <svg width="60" height="60">
            <circle
              stroke="currentColor"
              strokeWidth="2"
              fill="transparent"
              r="28"
              cx="30"
              cy="30"
            />

            <motion.circle
              //   className="text-primary"
              stroke="currentColor"
              strokeWidth="2"
              fill="transparent"
              r="28"
              cx="30"
              cy="30"
              style={{ strokeDasharray, rotate: -90 }}
              variants={{
                initial: { strokeDashoffset: circumference },
                hover: { strokeDashoffset: 0, color: "#fff" },
                focus: { strokeDashoffset: 0, color: "#fff" },
                active: { strokeDashoffset: 0, color: "#fff" },
              }}
              transition={{
                damping: 0,
                ...(shouldReduceMotion ? { duration: 0 } : null),
              }}
            />
          </svg>
        </div>

        <motion.span
          transition={shouldReduceMotion ? { duration: 0 } : {}}
          variants={shouldReduceMotion ? {} : arrowVariants[direction]}
        >
          <MoveUp
            className={cn(
              "size-7",
              direction === "right" && "rotate-90",
              direction === "left" && "-rotate-90",
              direction === "down" && "rotate-180",
              direction === "up" && "rotate-0"
            )}
          />
        </motion.span>
      </div>

      {children && (direction === "left" || direction === "down") ? (
        <span className="ml-8 text-xl font-medium">{children}</span>
      ) : null}
    </>
  );
}

// function ArrowButton({ ...props }: ArrowButtonBaseProps) {
//   const shouldReduceMotion = useReducedMotion()

//   return (
//     <motion.button
//       {...getBaseProps(props)}
//       animate="initial"
//       whileHover="hover"
//       whileFocus="active"
//       transition={shouldReduceMotion ? { duration: 0 } : {}}
//     >
//       <ArrowButtonContent {...props} />
//     </motion.button>
//   )
// }

function ArrowLink({ to, href, target, className, ...props }: ArrowLinkProps) {
  const shouldReduceMotion = useReducedMotion();

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        animate="initial"
        whileHover="hover"
        whileFocus="active"
        transition={shouldReduceMotion ? { duration: 0 } : {}}
        className={getBaseClass(className)}
      >
        <ArrowButtonContent {...props} />
      </motion.a>
    );
  } else if (to) {
    return (
      <MotionLink
        to={to}
        className={getBaseClass(className)}
        animate="initial"
        whileHover="hover"
        whileFocus="active"
        transition={shouldReduceMotion ? { duration: 0 } : {}}
      >
        <ArrowButtonContent {...props} />
      </MotionLink>
    );
  }
  throw new Error("Must provide either to or href to ArrowLink");
}

function BackLink({
  to,
  className,
  children,
}: { to: LinkProps["to"] } & Pick<ArrowLinkProps, "className" | "children">) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <MotionLink
      to={to}
      className={getBaseClass("text-primary flex space-x-4 focus:outline-none " + className)}
      animate="initial"
      whileHover="hover"
      whileFocus="active"
      transition={shouldReduceMotion ? { duration: 0 } : {}}
    >
      <motion.span
        variants={shouldReduceMotion ? {} : arrowVariants.left}
        transition={shouldReduceMotion ? { duration: 0 } : {}}
      >
        {/* <Icon size="xl" name="arrow-up" className="-rotate-90" /> */}
        <MoveUp name="arrow-up" className="size-7 -rotate-90" />
      </motion.span>
      <span>{children}</span>
    </MotionLink>
  );
}

export { ArrowLink, BackLink };
