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
import { PlusCircleIcon, SettingsIcon } from "lucide-react";
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
          <SettingsIcon />
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

                {/* //! Make an edit due or disc action  */}
                <DropdownMenuItem
                  onSelect={() => {
                    // setAddCustomScheduleEntryDialogIsOpen(true);
                    console.log("edit due or disc");
                  }}
                  className="dark:bg-black"
                >
                  Edit due or disconnection dates
                </DropdownMenuItem>

                {/* //! Make a delete action  */}
                {selectedScheduleEntry?.dueDate &&
                  selectedScheduleEntry?.disconnectionDate &&
                  selectedScheduleEntry.meterReaders &&
                  selectedScheduleEntry.meterReaders.length === 0 && (
                    <DropdownMenuItem
                      onSelect={() => {
                        // setAddCustomScheduleEntryDialogIsOpen(true);
                        console.log("Delete action here");
                      }}
                      className="dark:bg-black"
                    >
                      Delete schedule entry
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
