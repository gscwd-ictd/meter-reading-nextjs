import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@mr/components/ui/Dialog";
import { Button } from "@mr/components/ui/Button";
import { Input } from "@mr/components/ui/Input";
import { Label } from "@mr/components/ui/Label";
import { FunctionComponent, useEffect, useState } from "react";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Area } from "@mr/lib/types/zonebook";

export const EditAreaDialog: FunctionComponent = () => {
  const [name, setName] = useState("");
  const editAreaDialogIsOpen = useZonebookStore((state) => state.editAreaDialogIsOpen);
  const setEditAreaDialogIsOpen = useZonebookStore((state) => state.setEditAreaDialogIsOpen);
  const selectedArea = useZonebookStore((state) => state.selectedArea);
  const setSelectedArea = useZonebookStore((state) => state.setSelectedArea);

  const refetchAreas = useZonebookStore((state) => state.refetchAreas);

  const postAreaMutation = useMutation({
    mutationKey: ["add-new-area"],
    mutationFn: async (area: Area) => {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_MR_BE}/area/${area.id}`, {
        //! area: area.area,
        name: area.name,
      });

      return res.data;
    },
    onSuccess: async (area: Area) => {
      // refetch
      toast.success("Success", {
        description: `You have successfully updated the area from ${selectedArea.name} to ${area.name}`,
        position: "top-right",
      });
      setName("");

      refetchAreas?.();
      setEditAreaDialogIsOpen(false);
    },
  });

  useEffect(() => {
    if (editAreaDialogIsOpen && selectedArea) {
      setName(selectedArea.name);
    }
  }, [editAreaDialogIsOpen, selectedArea]);

  return (
    <Dialog
      open={editAreaDialogIsOpen}
      onOpenChange={() => {
        setEditAreaDialogIsOpen(!editAreaDialogIsOpen);
        setSelectedArea({} as Area);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">Edit Area Name</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="area-name">Name</Label>
            <Input
              id="area-name"
              placeholder="Enter area name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={async () => await postAreaMutation.mutateAsync({ name: name, id: selectedArea.id })}
            disabled={!name.trim()}
            className="w-[5rem]"
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
