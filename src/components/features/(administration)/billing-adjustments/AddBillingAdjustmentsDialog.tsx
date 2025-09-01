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
import { useBillingAdjustmentsStore } from "@mr/components/stores/useBillingAdjustmentsStore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BillingAdjustment } from "@mr/lib/types/billing-adjustment";
import { toast } from "sonner";
import { Button } from "@mr/components/ui/Button";
import { PlusCircleIcon } from "lucide-react";
import { Input } from "@mr/components/ui/Input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@mr/components/ui/Form";

// Zod validation schema
const billingAdjustmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  percentage: z
    .number()
    .min(0, "Minimum is 0")
    .max(100, "Cannot exceed 100")
    .refine((val) => !isNaN(val), "Must be a valid number"),
});

type FormValues = z.infer<typeof billingAdjustmentSchema>;

type AddBillingAdjustmentsDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const AddBillingAdjustmentsDialog: FunctionComponent<AddBillingAdjustmentsDialogProps> = ({
  open,
  setOpen,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(billingAdjustmentSchema),
    defaultValues: {
      name: "",
      percentage: 0,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const refetch = useBillingAdjustmentsStore((state) => state.refetch);

  const postBillingAdjustmentsMutation = useMutation({
    mutationKey: ["add-new-billing-adjustments"],
    mutationFn: async (data: BillingAdjustment) => {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_MR_BE}/billing-adjustments`, {
        name: data.name,
        percentage: data.percentage,
      });
      return res.data;
    },
    onSuccess: async () => {
      toast.success("Success", {
        description: "You have successfully added a new billing adjustment!",
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
    postBillingAdjustmentsMutation.mutate(data);
  };

  const setDefaultValues = () => {
    reset({ name: "", percentage: 0 });
    setOpen(!open);
  };

  return (
    <Dialog open={open} onOpenChange={setDefaultValues} modal>
      <DialogTrigger asChild className="w-full sm:w-full md:w-full lg:w-fit">
        <Button variant="default" className="dark:text-white">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add Billing Adjustments
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-semibold dark:text-white">
            Add Billing Adjustment
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Enter a name and its equivalent percentage.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter adjustment name" {...field} />
                  </FormControl>

                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Percentage (%)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter percentage of adjustment"
                      {...field}
                      type="number"
                      step="0.01"
                    />
                  </FormControl>

                  {errors.percentage && (
                    <p className="mt-1 text-xs text-red-500">{errors.percentage.message}</p>
                  )}
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                className="mt-4 h-[3rem] w-full dark:text-white"
                disabled={postBillingAdjustmentsMutation.isPending}
              >
                {postBillingAdjustmentsMutation.isPending ? "Saving..." : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
