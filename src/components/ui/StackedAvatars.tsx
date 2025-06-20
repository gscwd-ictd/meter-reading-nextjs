import React, { FunctionComponent } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./Avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./Tooltip";

export type AvatarUser = {
  id: string;
  name: string;
  image: string | null;
};

type StackedAvatarsProps = {
  users: AvatarUser[];
  limit?: number;
  size?: "sm" | "md" | "lg";
};

export const StackedAvatars: FunctionComponent<StackedAvatarsProps> = ({ users, limit = 3, size = "sm" }) => {
  const visibleUsers = users.slice(0, limit);
  const remaining = users.length - limit;

  // Size configurations
  const sizeStyles = {
    sm: {
      avatar: "h-6 w-6",
      overlap: "-ml-2",
      text: "text-xs",
      container: "space-x-[2px]",
    },
    md: {
      avatar: "h-8 w-8",
      overlap: "-ml-1",
      text: "text-sm",
      container: "space-x-[-1px]",
    },
    lg: {
      avatar: "h-10 w-10",
      overlap: "-ml-4",
      text: "text-base",
      container: "space-x-[-1px]",
    },
  };

  const styles = sizeStyles[size];

  return (
    <div className="flex items-center">
      <div className={`flex ${styles.container}`}>
        {visibleUsers.map((user, index) => (
          <TooltipProvider key={index} delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar
                  className={`${styles.avatar} ${
                    index !== 0 ? styles.overlap : ""
                  } ring-background cursor-pointer ring-2`}
                >
                  <AvatarImage src={user.image ?? undefined} alt={user.name} className="object-cover" />
                  <AvatarFallback className={styles.text}>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <span>{user.name}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      {remaining > 0 && (
        <span
          className={`${styles.avatar} ${styles.overlap} ${styles.text} ring-background bg-muted text-muted-foreground relative inline-flex items-center justify-center rounded-full ring-2`}
        >
          +{remaining}
        </span>
      )}
    </div>
  );
};
