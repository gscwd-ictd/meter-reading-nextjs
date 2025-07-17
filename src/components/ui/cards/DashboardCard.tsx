import { FunctionComponent, PropsWithChildren, ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../Card";

type DashboardCardProps = PropsWithChildren & {
  title?: string;
  className?: string;
  description?: string;
  action?: () => void;
  footer?: ReactNode | ReactNode[];
  icon?: ReactNode | ReactNode[];
};

export const DashboardCard: FunctionComponent<DashboardCardProps> = ({
  action,
  className,
  description,
  title,
  children,
  footer,
  icon,
}) => {
  return (
    <Card onClick={action} className={`${className} relative`}>
      {icon && <div className="absolute top-5 right-5">{icon}</div>}
      <CardHeader>
        <CardTitle className="text-lg font-normal tracking-wide">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};
