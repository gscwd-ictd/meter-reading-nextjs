"use client";

import { FunctionComponent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@mr/components/ui/Dialog";
import { Button } from "@mr/components/ui/Button";
import { Input } from "@mr/components/ui/Input";
import { Label } from "@mr/components/ui/Label";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { SearchAreaCombobox } from "../areas/SearchAreaCombobox";
import { Area, Zonebook } from "@mr/lib/types/zonebook";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const AssignAreaZonebookDialog: FunctionComponent = () => {
  const assignAreaZonebookDialogIsOpen = useZonebookStore((state) => state.assignAreaZonebookDialogIsOpen);
  const setAssignAreaZonebookDialogIsOpen = useZonebookStore(
    (state) => state.setAssignAreaZonebookDialogIsOpen,
  );
  const selectedArea = useZonebookStore((state) => state.selectedArea);
  const selectedZonebook = useZonebookStore((state) => state.selectedZonebook);
  const setSelectedZonebook = useZonebookStore((state) => state.setSelectedZonebook);
  const setSelectedArea = useZonebookStore((state) => state.setSelectedArea);
  const refetchZonebooks = useZonebookStore((state) => state.refetchZonebooks);

  const postAreaToZonebookMutation = useMutation({
    mutationKey: ["post-area-mutation", selectedArea.areaId],
    mutationFn: async (zonebook: Zonebook) => {
      console.log(zonebook);
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_MR_BE}/zone-book`, {
          zone: zonebook.zone,
          book: zonebook.book,
          areaId: zonebook.areaId,
        });

        return res.data;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    onSuccess: () => {
      toast.success("Success", {
        description: `You have successfully assigned area ${selectedArea.area} to zone book ${selectedZonebook?.zoneBook}`,
      });

      setSelectedArea({} as Area);
      setSelectedZonebook({} as Zonebook);
      setAssignAreaZonebookDialogIsOpen(false);
      refetchZonebooks?.();
    },
  });

  return (
    <Dialog
      open={assignAreaZonebookDialogIsOpen}
      onOpenChange={() => {
        setSelectedArea({} as Area);
        setAssignAreaZonebookDialogIsOpen(!assignAreaZonebookDialogIsOpen);
        setSelectedZonebook(null);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-primary">Assign Area to Zonebook</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="zoneBook" className="text-right">
              Zone Book
            </Label>
            <Input id="zoneBook" defaultValue={selectedZonebook?.zoneBook} disabled className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="zone" className="text-right">
              Zone
            </Label>
            <Input id="zone" defaultValue={selectedZonebook?.zone} disabled className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="book" className="text-right">
              Book
            </Label>
            <Input id="book" defaultValue={selectedZonebook?.book} disabled className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="area" className="text-right">
              Area
            </Label>
            <div className="col-span-3">
              <SearchAreaCombobox />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedArea({} as Area);
              setAssignAreaZonebookDialogIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            className="dark:text-white"
            onClick={async () => {
              await postAreaToZonebookMutation.mutateAsync({
                zone: selectedZonebook!.zone!,
                book: selectedZonebook!.book!,
                areaId: selectedArea.areaId,
                zoneBook: selectedZonebook!.zoneBook!,
                area: selectedArea.area,
              });
            }}
          >
            Assign area
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
