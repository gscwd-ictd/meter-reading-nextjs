import { Button } from "@mr/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mr/components/ui/DropdownMenu";
import { MeterReader } from "@mr/lib/types/personnel";
import { Ellipsis } from "lucide-react";
import { FunctionComponent, useState } from "react";

type UserAccountsDropdownActionsProps = {
  meterReader: MeterReader;
};

export const UserAccountsDropdownActions: FunctionComponent<UserAccountsDropdownActionsProps> = ({
  meterReader,
}) => {
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
        <DropdownMenuItem onClick={() => console.log(meterReader)}>Change Password</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => console.log(meterReader)}>Reset Password</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
