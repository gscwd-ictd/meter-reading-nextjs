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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

// Define form schema
const formSchema = z.object({
  name: z.string().min(1, "Area name is required").trim(),
});

export function AddAreaDialog() {
  const refetchAreas = useZonebookStore((state) => state.refetchAreas);
  const addAreaDialogIsOpen = useZonebookStore((state) => state.addAreaDialogIsOpen);
  const setAddAreaDialogIsOpen = useZonebookStore((state) => state.setAddAreaDialogIsOpen);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const postAreaMutation = useMutation({
    mutationKey: ["add-new-area"],
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_MR_BE}/area`, data);
      return res.data;
    },
    onSuccess: async () => {
      toast.success("Success", {
        description: "You have successfully added a new area!",
        position: "top-right",
      });

      // Reset form and close dialog
      form.reset();
      setAddAreaDialogIsOpen(false);
      refetchAreas?.();
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to add area",
        position: "top-right",
      });
    },
  });

  // Form submission handler
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    postAreaMutation.mutate(data);
  };

  return (
    <Dialog open={addAreaDialogIsOpen} onOpenChange={setAddAreaDialogIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-semibold dark:text-white">
            Add New Area
          </DialogTitle>
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

            <DialogFooter className="flex w-full">
              <Button
                type="submit"
                disabled={postAreaMutation.isPending || !form.formState.isValid}
                className="w-full dark:text-white"
              >
                {postAreaMutation.isPending ? "Adding..." : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
