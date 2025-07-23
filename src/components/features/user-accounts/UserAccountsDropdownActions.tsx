import { Button } from "@mr/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mr/components/ui/DropdownMenu";
import { Ellipsis } from "lucide-react";
import { useState } from "react";

export const UserAccountsDropdownActions = () => {
  const [dropdownIsOpen, setDropdownIsOpen] = useState<boolean>(false);

  return (
    <DropdownMenu
      open={dropdownIsOpen}
      onOpenChange={() => {
        setDropdownIsOpen(!dropdownIsOpen);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent avoidCollisions alignOffset={2} sideOffset={2} align="end">
        <DropdownMenuItem>Change Password</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Reset Password</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
