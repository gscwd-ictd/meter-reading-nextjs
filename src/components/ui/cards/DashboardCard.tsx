"use client";
import { FunctionComponent, MouseEventHandler, PropsWithChildren, ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../Card";
import { ArrowRightCircleIcon } from "lucide-react";
import { Button } from "../Button";

type DashboardCardProps = PropsWithChildren & {
  title?: string;
  className?: string;
  description?: string;
  onCardClick?: () => void;
  footer?: ReactNode | ReactNode[];
  icon?: ReactNode | ReactNode[];
  onButtonClick?: MouseEventHandler<HTMLButtonElement>;
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
}) => {
  return (
    <Card onClick={onCardClick} className={`${className} relative`}>
      {icon && <div className="absolute top-5 right-5">{icon}</div>}
      <CardHeader>
        <CardTitle className="text-lg font-normal tracking-wide">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
      {onButtonClick && (
        <Button variant="ghost" className="text-primary absolute right-2 bottom-2" onClick={onButtonClick}>
          <ArrowRightCircleIcon className="size-full" />
        </Button>
      )}
    </Card>
  );
};
