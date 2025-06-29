import type { JSX } from "react";
import { cn } from "~/utils/cn";

export function GradientBG({ className }: JSX.IntrinsicElements["svg"]) {
  return (
    // <div className="aspect-square h-1/4 rounded-full bg-radial from-yelight from-10% to-transparent to-100%" />

    <svg className={cn(className)} viewBox="0 0 200 200">
      <path
        fill="#FDBA0F"
        fillOpacity="0.3"
        d="M38.6,-65.3C45.8,-55.5,44.3,-37.6,45.7,-24C47,-10.4,51.2,-1.2,55.1,11.6C59.1,24.5,62.7,41,56.7,50.7C50.7,60.4,35.1,63.3,20.7,64.9C6.4,66.4,-6.6,66.7,-15.9,60.9C-25.2,55.1,-30.6,43.2,-40.7,33.9C-50.7,24.7,-65.3,18.1,-69.6,8.2C-73.9,-1.7,-67.8,-15,-59.2,-24.2C-50.5,-33.4,-39.4,-38.6,-29.1,-46.9C-18.8,-55.2,-9.4,-66.7,3.2,-71.6C15.8,-76.6,31.5,-75,38.6,-65.3Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}
