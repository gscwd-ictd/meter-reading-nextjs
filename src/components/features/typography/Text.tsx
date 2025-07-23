import { cn } from "@mr/lib/utils";
import { ComponentProps, type FunctionComponent } from "react";

type TextProps = ComponentProps<"p"> & {
  variant: "small" | "large";
  muted?: boolean;
};

export const Text: FunctionComponent<TextProps> = ({
  muted = false,
  variant,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        variant === "small" ? "text-sm font-medium leading-none" : "text-lg font-semibold",
        muted ? "text-muted-foreground" : "text-primary",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
