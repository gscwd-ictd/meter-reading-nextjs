"use client";
import { Button } from "@mr/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@mr/components/ui/DropdownMenu";
import { AnimatePresence, motion } from "framer-motion";
import { PlusCircleIcon } from "lucide-react";
import { FunctionComponent, useState } from "react";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";

export const AddCustomScheduleEntryOptionsDropdown: FunctionComponent = () => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const selectedScheduleEntry = useSchedulesStore((state) => state.selectedScheduleEntry);

  const setAddCustomMeterReaderDialogIsOpen = useSchedulesStore(
    (state) => state.setAddCustomMeterReaderDialogIsOpen,
  );
  const setAddCustomScheduleEntryDialogIsOpen = useSchedulesStore(
    (state) => state.setAddCustomScheduleEntryDialogIsOpen,
  );

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-primary hover:bg-transparent">
          <PlusCircleIcon />
        </Button>
      </DropdownMenuTrigger>
      <AnimatePresence>
        {dropdownOpen && (
          <DropdownMenuPortal>
            <DropdownMenuContent align="start" side="right" sideOffset={0} asChild className="p-0">
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 1, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                className="flex flex-col overflow-clip rounded bg-white shadow-lg"
              >
                {!selectedScheduleEntry?.dueDate && !selectedScheduleEntry?.disconnectionDate && (
                  <DropdownMenuItem
                    onSelect={() => {
                      setAddCustomScheduleEntryDialogIsOpen(true);
                    }}
                    className="dark:bg-black"
                  >
                    Add schedule entry
                  </DropdownMenuItem>
                )}
                {selectedScheduleEntry?.dueDate && selectedScheduleEntry?.disconnectionDate && (
                  <DropdownMenuItem
                    onSelect={() => {
                      setAddCustomMeterReaderDialogIsOpen(true);
                    }}
                    className="dark:bg-black"
                  >
                    Add meter reader
                  </DropdownMenuItem>
                )}
              </motion.div>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        )}
      </AnimatePresence>
    </DropdownMenu>
  );
};
