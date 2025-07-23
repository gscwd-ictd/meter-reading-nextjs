import { cn } from "@mr/lib/utils";
import type { PropsWithChildren, FunctionComponent, ComponentProps } from "react";

type HeadingProps = ComponentProps<"h1" | "h2" | "h3" | "h4"> &
  PropsWithChildren & {
    variant: "h1" | "h2" | "h3" | "h4";
  };

export const Heading: FunctionComponent<HeadingProps> = ({ variant, children, className, ...props }) => {
  if (variant === "h1") {
    return (
      <h1
        className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)}
        {...props}
      >
        {children}
      </h1>
    );
  }

  if (variant === "h2") {
    return (
      <h2
        className={cn("scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0", className)}
        {...props}
      >
        {children}
      </h2>
    );
  }

  if (variant === "h3") {
    return (
      <h3 className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)} {...props}>
        {children}
      </h3>
    );
  }

  return (
    <h4 className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)} {...props}>
      {children}
    </h4>
  );
};
