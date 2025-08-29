"use client";

import { FunctionComponent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@mr/components/ui/Dialog";
import { Button } from "@mr/components/ui/Button";
import { Input } from "@mr/components/ui/Input";
import { Label } from "@mr/components/ui/Label";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { Area, Zonebook } from "@mr/lib/types/zonebook";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { SearchAreaCombobox } from "../../(administration)/areas/SearchAreaCombobox";

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
    enabled: !!assignAreaZonebookDialogIsOpen,
  });

  const postAreaToZonebookMutation = useMutation({
    mutationKey: ["post-area-mutation", selectedArea.id],
    mutationFn: async (zonebook: Zonebook) => {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_MR_BE}/zone-book`, {
        zone: zonebook.zone,
        book: zonebook.book,
        area: zonebook.area.id ? zonebook.area : { ...zonebook.area, id: null },
      });

      return res.data;
    },
    onSuccess: () => {
      toast.success("Success", {
        description: `You have successfully assigned ${selectedArea.name ? `area ${selectedArea.name}` : "an empty area"} to zone book ${selectedZonebook?.zoneBook}`,
        position: "top-right",
      });

      setSelectedArea({} as Area);
      setSelectedZonebook({} as Zonebook);
      setAssignAreaZonebookDialogIsOpen(false);
      refetchZonebooks?.();
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Something went wrong.";
        toast.error(message, { position: "top-right", duration: 1500 });
      } else {
        toast.error("An unexpected error occurred", { position: "top-right" });
      }
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
                // areaId: selectedArea.areaId,
                zoneBook: selectedZonebook!.zoneBook!,
                area: selectedArea,
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
