"use client";
import { Dispatch, FunctionComponent, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@mr/components/ui/Dialog";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@mr/components/ui/Button";
import { PlusCircleIcon } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@mr/components/ui/Input";
import { useReadingRemarksStore } from "@mr/components/stores/useReadingRemarksStore";
import { ReadingRemark } from "@mr/lib/types/reading-remark";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@mr/components/ui/Form";
import { Switch } from "@mr/components/ui/Switch";

// Zod validation schema
const readingRemarksSchema = z.object({
  name: z.string().min(1, "Name is required"),
  isAverage: z.boolean(),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof readingRemarksSchema>;

type AddReadingRemarksDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const AddReadingRemarksDialog: FunctionComponent<AddReadingRemarksDialogProps> = ({
  open,
  setOpen,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(readingRemarksSchema),
    defaultValues: {
      name: "",
      isAverage: false,
      isActive: true,
    },
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = form;

  const refetch = useReadingRemarksStore((state) => state.refetch);

  const postReadingRemarksMutation = useMutation({
    mutationKey: ["add-new-reading-remarks"],
    mutationFn: async (data: ReadingRemark) => {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_MR_BE}/reading-remarks`, {
        name: data.name,
        isAverage: data.isAverage,
        isActive: data.isActive,
      });
      return res.data;
    },
    onSuccess: async () => {
      toast.success("Success", {
        description: "You have successfully added a new reading remark!",
        position: "top-right",
      });
      reset();
      refetch?.();
      setOpen(false);
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to perform action.";
        toast.error(message, { position: "top-right", duration: 1500 });
      } else {
        toast.error("An unexpected error occurred", { position: "top-right" });
      }
    },
  });

  const onSubmit = (data: FormValues) => {
    postReadingRemarksMutation.mutate(data);
  };

  const setDefaultValues = () => {
    setValue("isActive", true);
    setValue("isAverage", false);
    setOpen(!open);
  };

  return (
    <Dialog open={open} onOpenChange={setDefaultValues} modal>
      <DialogTrigger asChild className="w-full sm:w-full md:w-full lg:w-fit">
        <Button variant="default" className="dark:text-white">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add Reading Remark
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md space-y-6 rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-semibold dark:text-white">
            Add Reading Remark
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Create a new remark with optional settings.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Remark name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Remark Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter remark name" {...field} />
                  </FormControl>
                  <FormDescription className="text-muted-foreground text-xs">
                    Give this remark a short and clear name.
                  </FormDescription>
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </FormItem>
              )}
            />

            {/* Average toggle */}
            <FormField
              control={form.control}
              name="isAverage"
              render={({ field }) => (
                <FormItem className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition">
                  <div>
                    <FormLabel className="font-medium">Average</FormLabel>
                    <FormDescription className="text-muted-foreground text-xs">
                      Automatically compute the average consumption?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Active toggle */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition">
                  <div>
                    <FormLabel className="font-medium">Active</FormLabel>
                    <FormDescription className="text-muted-foreground text-xs">
                      Set this remark as active or inactive.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Footer */}
            <DialogFooter className="flex justify-end space-x-2">
              <Button
                type="submit"
                disabled={postReadingRemarksMutation.isPending}
                className="w-full px-6 dark:text-white"
              >
                {postReadingRemarksMutation.isPending ? "Saving..." : "Add Remark"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
