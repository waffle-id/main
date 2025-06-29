import { cn } from "~/utils/cn";
import { motion } from "framer-motion";
import type { JSX } from "react";

// export default function CircleButton() {
//   return (
//     <button
//       className={clsxm([
//         "relative inline-flex px-[13px] py-[3px] text-white items-center justify-center w-[170px] h-[170px] transform -rotate-[15deg]",
//         "before:absolute before:block before:top-0 before:left-0 before:w-full before:h-full before:bg-black/90 before:rounded-[50%]",
//       ])}
//     >
//       <span className="z-10">oke</span>
//     </button>
//   );
// }

type CircleButtonProps = {
  text: string;
} & JSX.IntrinsicElements["button"];

export function CircleButton(props: CircleButtonProps) {
  const { text, type = "button", onClick } = props;
  return (
    <motion.button
      className={cn([
        "overflow-hidden rounded-full",
        "border-2 border-foreground bg-transparent text-foreground transition-colors duration-500",
        "hover:border-0 hover:bg-foreground hover:text-background",
      ])}
      animate="initial"
      style={{
        width: "10rem",
        height: "10rem",
      }}
      variants={{
        initial: {
          scale: 1,
        },
        hover: {
          scale: 1.1,
        },
      }}
      transition={{
        duration: 0.3,
      }}
      whileHover="hover"
      type={type}
      onClick={onClick}
    >
      <motion.div
        style={{
          rotateZ: "-15deg",
          position: "relative",
          userSelect: "none",
          overflow: "hidden",
        }}
      >
        <motion.p
          style={{ padding: "4px" }}
          variants={{
            initial: { y: 0 },
            hover: { y: "-100%" },
          }}
        >
          {text}
        </motion.p>
        <motion.p
          className="inset-0"
          style={{ position: "absolute", padding: "4px", y: "100%" }}
          variants={{
            initial: { y: "100%" },
            hover: { y: 0 },
          }}
        >
          {text}
        </motion.p>
      </motion.div>
    </motion.button>
  );
}
