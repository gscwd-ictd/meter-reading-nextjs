"use client";
import { FunctionComponent, MouseEventHandler, PropsWithChildren, ReactNode, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../Card";
import { Button } from "../Button";

type DashboardCardProps = PropsWithChildren & {
  title?: string;
  className?: string;
  description?: string;
  onCardClick?: () => void;
  footer?: ReactNode | ReactNode[];
  icon?: ReactNode | ReactNode[];
  onButtonClick?: MouseEventHandler<HTMLButtonElement>;
  size?: "sm" | "lg";
};

export const DashboardCard: FunctionComponent<DashboardCardProps> = ({
  onCardClick,
  className,
  description,
  title,
  children,
  footer,
  icon,
  onButtonClick,
  size = "lg",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      onClick={onCardClick}
      className={`group relative overflow-hidden ${className} transition-all hover:shadow-md hover:brightness-98 ${size === "lg" ? "gap-3" : "gap-0"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Shine effect */}
      <span className="shine pointer-events-none absolute inset-0 z-10 -translate-x-full bg-gradient-to-r from-transparent via-white/80 to-slate-700/20 dark:to-transparent" />

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
        <CardTitle className="text-lg font-normal tracking-wide">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
      {onButtonClick && (
        <Button
          variant="ghost"
          className="text-primary hover:text-primary absolute right-2 bottom-0 z-20 size-fit opacity-0 transition-opacity duration-200 group-hover:opacity-70 hover:bg-transparent hover:opacity-100"
          onClick={onButtonClick}
        >
          View more
        </Button>
      )}
    </Card>
  );
};
