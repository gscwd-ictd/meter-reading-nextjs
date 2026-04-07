"use client";
import { FunctionComponent, MouseEventHandler, PropsWithChildren, ReactNode, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../Card";
import { Button } from "../Button";

type DashboardCardProps = PropsWithChildren & {
  title?: string;
  subtitle?: string;
  className?: string;
  description?: string;
  onCardClick?: () => void;
  footer?: ReactNode | ReactNode[];
  icon?: ReactNode | ReactNode[];
  onButtonClick?: MouseEventHandler<HTMLButtonElement>;
  size?: "sm" | "lg";
  buttonPlacement?: "top-right" | "bottom-right" | "top-left" | "bottom-left";
  titleClassName?: string;
};

export const DashboardCard: FunctionComponent<DashboardCardProps> = ({
  onCardClick,
  className,
  description,
  title,
  children,
  footer,
  icon,
  titleClassName = "text-gray-800 dark:text-gray-400",
  onButtonClick,
  size = "lg",
  buttonPlacement = "top-right",
  subtitle,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      onClick={onCardClick}
      className={`group relative overflow-hidden ${className} shadow-xs transition-all hover:shadow-md hover:brightness-98 ${size === "lg" ? "gap-3" : "gap-0"} border-gray-200/70 dark:border-gray-800`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Shine effect */}
      <span className="shine pointer-events-none absolute inset-0 z-10 -translate-full bg-gradient-to-r from-transparent via-white/80 to-slate-700/20 dark:to-transparent" />
      {onButtonClick && (
        <Button
          variant="ghost"
          className={`${buttonPlacement == "top-right" ? "top-2 right-2" : buttonPlacement === "bottom-right" ? "right-2 bottom-2" : buttonPlacement === "top-left" ? "top-2 left-2" : buttonPlacement === "bottom-left" && "bottom-2 left-2"} text-primary hover:text-primary absolute z-20 size-fit opacity-0 transition-opacity duration-200 group-hover:opacity-70 hover:bg-transparent hover:opacity-100`}
          onClick={onButtonClick}
        >
          View more
        </Button>
      )}
      {icon && (
        <div
          className="absolute top-5 right-5 z-20"
          style={{
            animation: isHovered ? "shake 0.5s ease-in-out infinite" : "none",
          }}
        >
          {icon}
        </div>
      )}
      <CardHeader>
        <CardTitle
          className={`${titleClassName} text-base font-medium tracking-tight sm:text-xl lg:text-base`}
        >
          {title}
          {subtitle !== "" && (
            <div className="text-xs font-normal tracking-normal text-gray-500/85">{subtitle}</div>
          )}
        </CardTitle>

        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};
