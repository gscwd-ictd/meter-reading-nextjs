"use client";

import { FunctionComponent, useEffect } from "react";
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

  const { data: zonebook } = useQuery({
    queryKey: ["get-zonebook-by-id", selectedZonebook?.id],
    queryFn: async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/zone-book/${selectedZonebook?.id}`);
        return res.data;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    enabled: editAssignAreaZonebookDialogIsOpen && selectedZonebook?.id !== null,
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
    mutationKey: ["patch-area-mutation", selectedZonebook?.id],
    mutationFn: async (zonebook: Zonebook) => {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_MR_BE}/zone-book/${zonebook.id}`, {
        area: zonebook.area.id ? zonebook.area : { ...zonebook.area, id: null },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Success", {
        description: `Successfully reassigned ${selectedArea.name ? `"${selectedArea.name}"` : "no area"} to zone book ${selectedZonebook?.zoneBook}`,
        position: "top-right",
      });

      setSelectedArea({} as Area);
      setSelectedZonebook({} as Zonebook);
      setEditAssignAreaZonebookDialogIsOpen(false);
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

  useEffect(() => {
    if (zonebook && editAssignAreaZonebookDialogIsOpen) {
      setSelectedArea({ name: zonebook.area.name, id: zonebook.area.id });
    }
  }, [zonebook, editAssignAreaZonebookDialogIsOpen, setSelectedArea]);

  const isSubmitting = patchAreaToZonebookMutation.isPending;

  return (
    <Dialog
      open={editAssignAreaZonebookDialogIsOpen}
      onOpenChange={() => {
        setSelectedArea({} as Area);
        setEditAssignAreaZonebookDialogIsOpen(!editAssignAreaZonebookDialogIsOpen);
        setSelectedZonebook(null);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="-space-y-2">
          <DialogTitle className="text-lg font-semibold text-gray-700 dark:text-white">
            Reassign Area to Zonebook
          </DialogTitle>
          <p className="text-muted-foreground text-sm">Change the area assignment for this zone book.</p>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Zone */}
          <div className="space-y-1.5">
            <Label htmlFor="zone" className="text-sm font-medium text-gray-700">
              Zone
            </Label>
            <Input
              id="zone"
              defaultValue={selectedZonebook?.zone}
              disabled
              className="bg-gray-50"
              placeholder="—"
            />
          </div>

          {/* Book */}
          <div className="space-y-1.5">
            <Label htmlFor="book" className="text-sm font-medium text-gray-700">
              Book
            </Label>
            <Input
              id="book"
              defaultValue={selectedZonebook?.book}
              disabled
              className="bg-gray-50"
              placeholder="—"
            />
          </div>

          {/* Current Area (optional - shows existing assignment) */}
          {zonebook?.area?.name && (
            <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-950/20">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Current Assignment</p>
              <p className="text-sm text-blue-900 dark:text-blue-200">{zonebook.area.name}</p>
            </div>
          )}

          {/* Area Selection */}
          <div className="space-y-1.5">
            <Label htmlFor="area" className="text-sm font-medium text-gray-700">
              New Area
            </Label>
            {areaList && (
              <SearchAreaCombobox areaList={areaList} isLoading={isLoading} isPending={isPending} />
            )}
            <p className="text-xs text-gray-400">Select an area to assign to this zone book</p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedArea({} as Area);
              setEditAssignAreaZonebookDialogIsOpen(false);
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="dark:text-white"
            onClick={async () => {
              await patchAreaToZonebookMutation.mutateAsync({
                zone: selectedZonebook!.zone!,
                book: selectedZonebook!.book!,
                zoneBook: selectedZonebook!.zoneBook!,
                area: selectedArea,
                id: selectedZonebook?.id,
                day: selectedZonebook && selectedZonebook.day ? selectedZonebook.day : null,
              });
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Reassigning..." : "Reassign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
