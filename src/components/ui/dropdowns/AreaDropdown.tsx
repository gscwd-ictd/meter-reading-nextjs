"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@mr/components/ui/DropdownMenu";
import { Button } from "@mr/components/ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import { PlusCircleIcon } from "lucide-react";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";

interface AddNewDropdownProps {
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
}

export function AreaDropdown({ dropdownOpen, setDropdownOpen }: AddNewDropdownProps) {
  const setAddAreaDialogIsOpen = useZonebookStore((state) => state.setAddAreaDialogIsOpen);

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="dark:text-white">
          <PlusCircleIcon className="text-primary" />
        </Button>
      </DropdownMenuTrigger>

      <AnimatePresence>
        {dropdownOpen && (
          <DropdownMenuContent align="start" side="right" sideOffset={4} asChild forceMount>
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="flex min-w-[200px] flex-col overflow-hidden rounded-md bg-white shadow-md"
            >
              <DropdownMenuItem
                className="text-primary hover:bg-muted/50 cursor-pointer text-sm font-medium"
                onClick={() => {
                  setAddAreaDialogIsOpen(true);
                }}
              >
                Add an area
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-primary hover:bg-muted/50 cursor-pointer text-sm font-medium"
                onClick={() => {}}
              >
                Assign area to zone book
              </DropdownMenuItem>
            </motion.div>
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  );
}
