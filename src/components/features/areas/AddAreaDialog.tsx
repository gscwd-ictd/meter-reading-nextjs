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
          <DialogTitle className="text-primary">Add New Area</DialogTitle>
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
            onClick={async () => await postAreaMutation.mutateAsync(name)}
            disabled={!name.trim()}
            className="w-[5rem]"
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
