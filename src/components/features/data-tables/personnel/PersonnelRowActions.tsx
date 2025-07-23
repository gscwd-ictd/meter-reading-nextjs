"use client";

import { Button } from "@mr/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mr/components/ui/DropdownMenu";
import { MoreHorizontal, MoreVertical } from "lucide-react";
import { FunctionComponent } from "react";

type PersonnelRowActionsProps = {
  companyId: string;
};

export const PersonnelRowActions: FunctionComponent<PersonnelRowActionsProps> = ({ companyId }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
          <div className="hidden sm:hidden md:block lg:block">
            <MoreHorizontal />
          </div>
          <div className="block sm:block md:hidden lg:hidden">
            <MoreVertical />
          </div>
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => console.log(companyId)} className="cursor-pointer">
          Update personnel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
