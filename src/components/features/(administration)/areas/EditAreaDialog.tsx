import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@mr/components/ui/Dialog";
import { Button } from "@mr/components/ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@mr/components/ui/Form";
import { Input } from "@mr/components/ui/Input";
import { FunctionComponent, useEffect } from "react";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Area } from "@mr/lib/types/zonebook";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define form schema
const formSchema = z.object({
  name: z.string().min(1, "Area name is required").trim(),
});

export const EditAreaDialog: FunctionComponent = () => {
  const editAreaDialogIsOpen = useZonebookStore((state) => state.editAreaDialogIsOpen);
  const setEditAreaDialogIsOpen = useZonebookStore((state) => state.setEditAreaDialogIsOpen);
  const selectedArea = useZonebookStore((state) => state.selectedArea);
  const setSelectedArea = useZonebookStore((state) => state.setSelectedArea);
  const refetchAreas = useZonebookStore((state) => state.refetchAreas);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const postAreaMutation = useMutation({
    mutationKey: ["edit-area"],
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_MR_BE}/area/${selectedArea?.id}`, {
        name: data.name,
      });
      return res.data;
    },
    onSuccess: async (area: Area) => {
      toast.success("Success", {
        description: `You have successfully updated the area from ${selectedArea?.name} to ${area.name}`,
        position: "top-right",
      });

      // Reset form and close dialog
      form.reset();
      setEditAreaDialogIsOpen(false);
      setSelectedArea({} as Area);
      refetchAreas?.();
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to update area",
        position: "top-right",
      });
    },
  });

  // Populate form when dialog opens or selectedArea changes
  useEffect(() => {
    if (editAreaDialogIsOpen && selectedArea) {
      form.reset({
        name: selectedArea.name,
      });
    }
  }, [editAreaDialogIsOpen, selectedArea, form]);

  // Form submission handler
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (selectedArea) {
      postAreaMutation.mutate(data);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setEditAreaDialogIsOpen(open);
    if (!open) {
      setSelectedArea({} as Area);
      form.reset();
    }
  };

  return (
    <Dialog open={editAreaDialogIsOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-semibold dark:text-white">Edit Area</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Enter area information
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="area-name">Name</FormLabel>
                  <FormControl>
                    <Input id="area-name" placeholder="Enter area name" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-2">
              <Button
                type="submit"
                disabled={postAreaMutation.isPending || !form.formState.isValid}
                className="w-full dark:text-white"
              >
                {postAreaMutation.isPending ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
