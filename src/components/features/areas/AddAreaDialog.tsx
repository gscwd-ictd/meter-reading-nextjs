import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@mr/components/ui/Dialog";
import { Button } from "@mr/components/ui/Button";
import { Input } from "@mr/components/ui/Input";
import { Label } from "@mr/components/ui/Label";
import { useState } from "react";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export function AddAreaDialog() {
  const [name, setName] = useState("");

  const refetchAreas = useZonebookStore((state) => state.refetchAreas);

  const postAreaMutation = useMutation({
    mutationKey: ["add-new-area"],
    mutationFn: async (name: string) => {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_MR_BE}/area`, { name });

      return res.data;
    },
    onSuccess: async () => {
      // refetch
      toast.success("Success", {
        description: "You have successfully added a new area!",
        position: "top-right",
      });
      setName("");

      refetchAreas?.();
      setAddAreaDialogIsOpen(false);
    },
  });

  const addAreaDialogIsOpen = useZonebookStore((state) => state.addAreaDialogIsOpen);
  const setAddAreaDialogIsOpen = useZonebookStore((state) => state.setAddAreaDialogIsOpen);

  return (
    <Dialog open={addAreaDialogIsOpen} onOpenChange={setAddAreaDialogIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-semibold">Add New Area</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">Enter area information</DialogDescription>
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
        <DialogFooter className="flex w-full">
          <Button
            onClick={async () => await postAreaMutation.mutateAsync(name)}
            disabled={!name.trim()}
            className="w-full dark:text-white"
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
