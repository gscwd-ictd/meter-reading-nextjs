"use client";

import { FunctionComponent, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@mr/components/ui/Dialog";
import { Button } from "@mr/components/ui/Button";
import { Input } from "@mr/components/ui/Input";
import { Label } from "@mr/components/ui/Label";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { SearchAreaCombobox } from "../areas/SearchAreaCombobox";
import { Area, Zonebook } from "@mr/lib/types/zonebook";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const EditAssignAreaZonebookDialog: FunctionComponent = () => {
  const editAssignAreaZonebookDialogIsOpen = useZonebookStore(
    (state) => state.editAssignAreaZonebookDialogIsOpen,
  );
  const setEditAssignAreaZonebookDialogIsOpen = useZonebookStore(
    (state) => state.setEditAssignAreaZonebookDialogIsOpen,
  );
  const selectedArea = useZonebookStore((state) => state.selectedArea);
  const selectedZonebook = useZonebookStore((state) => state.selectedZonebook);
  const setSelectedZonebook = useZonebookStore((state) => state.setSelectedZonebook);
  const setSelectedArea = useZonebookStore((state) => state.setSelectedArea);
  const refetchZonebooks = useZonebookStore((state) => state.refetchZonebooks);

  const { data: area } = useQuery({
    queryKey: ["get-area-by-zonebook-id", selectedZonebook?.zoneBookId],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_MR_BE}/zone-book/${selectedZonebook?.zoneBookId}`,
        );

        return res.data;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    enabled: editAssignAreaZonebookDialogIsOpen && selectedZonebook?.zoneBookId !== null,
  });

  const {
    data: areaList,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["get-all-areas"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/area`);
      return res.data as Area[];
    },
    enabled: !!editAssignAreaZonebookDialogIsOpen,
  });

  const patchAreaToZonebookMutation = useMutation({
    mutationKey: ["patch-area-mutation", selectedZonebook?.zoneBookId],
    mutationFn: async (zonebook: Zonebook) => {
      try {
        const res = await axios.patch(`${process.env.NEXT_PUBLIC_MR_BE}/zone-book/${zonebook.zoneBookId}`, {
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
        description: `You have successfully reassigned the area to ${selectedArea.area} on zone book ${selectedZonebook?.zoneBook}`,
      });

      setSelectedArea({} as Area);
      setSelectedZonebook({} as Zonebook);
      setEditAssignAreaZonebookDialogIsOpen(false);
      refetchZonebooks?.();
    },
  });

  useEffect(() => {
    if (area && editAssignAreaZonebookDialogIsOpen) setSelectedArea({ area: area.area, areaId: area.areaId });
  }, [area, editAssignAreaZonebookDialogIsOpen]);

  return (
    <Dialog
      open={editAssignAreaZonebookDialogIsOpen}
      onOpenChange={() => {
        setSelectedArea({} as Area);
        setEditAssignAreaZonebookDialogIsOpen(!editAssignAreaZonebookDialogIsOpen);
        setSelectedZonebook(null);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-primary">Reassign Area to Zonebook</DialogTitle>
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
              {areaList && (
                <SearchAreaCombobox areaList={areaList} isLoading={isLoading} isPending={isPending} />
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedArea({} as Area);
              setEditAssignAreaZonebookDialogIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            className="dark:text-white"
            onClick={async () => {
              await patchAreaToZonebookMutation.mutateAsync({
                zone: selectedZonebook!.zone!,
                book: selectedZonebook!.book!,
                areaId: selectedArea.areaId,
                zoneBook: selectedZonebook!.zoneBook!,
                area: selectedArea.area,
                zoneBookId: selectedZonebook?.zoneBookId,
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
