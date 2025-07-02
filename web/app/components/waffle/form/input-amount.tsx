import { Input } from "~/components/shadcn/input";
import { cn } from "~/utils/cn";

export function InputAmount({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <Input
      type="number"
      inputMode="decimal"
      className={cn(
        "bg-transparent border-0 focus-visible:border-0 focus-visible:ring-0 md:text-4xl h-max shadow-none underline",
        className
      )}
      {...props}
    />
  );
}
