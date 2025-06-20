"use client";

import { Button } from "@mr/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mr/components/ui/DropdownMenu";
import { MoreHorizontal, MoreVertical } from "lucide-react";
import { FunctionComponent, useState } from "react";
import { EditMeterReaderDialog } from "../../meter-readers/EditMeterReaderDialog";
import { useMeterReadersStore } from "@mr/components/stores/useMeterReadersStore";
import { MeterReader } from "@mr/lib/types/personnel";
import { DeleteMeterReaderDialog } from "../../meter-readers/DeleteMeterReaderDialog";

type MeterReaderRowActionsProps = {
  meterReader: MeterReader;
};

export const MeterReaderRowActions: FunctionComponent<MeterReaderRowActionsProps> = ({ meterReader }) => {
  const [editMeterReaderDialogIsOpen, setEditMeterReaderDialogIsOpen] = useState<boolean>(false);
  const [dropdownIsOpen, setDropdownIsOpen] = useState<boolean>(false);

  const setSelectedMeterReader = useMeterReadersStore((state) => state.setSelectedMeterReader);

  return (
    <DropdownMenu open={dropdownIsOpen} onOpenChange={setDropdownIsOpen}>
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
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem
          onSelect={() => {
            setSelectedMeterReader(meterReader);
            setDropdownIsOpen(false);
          }}
          className="cursor-pointer"
          asChild
        >
          {/* Update personnel */}
          <EditMeterReaderDialog
            editMeterReaderDialogIsOpen={editMeterReaderDialogIsOpen}
            setEditMeterReaderDialogIsOpen={setEditMeterReaderDialogIsOpen}
            selectedMeterReader={meterReader}
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          onSelect={() => {
            setDropdownIsOpen(false);
          }}
        >
          <DeleteMeterReaderDialog selectedMeterReader={meterReader} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
