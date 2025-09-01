"use client";
import { Dispatch, FunctionComponent, SetStateAction, useEffect } from "react";
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
import { Label } from "@radix-ui/react-label";
import { Input } from "@mr/components/ui/Input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@mr/components/ui/Form";

// Zod validation schema
const billingAdjustmentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  percentage: z
    .number()
    .min(0, "Minimum is 0")
    .max(100, "Cannot exceed 100")
    .refine((val) => !isNaN(val), "Must be a valid number"),
});

type FormValues = z.infer<typeof billingAdjustmentSchema>;

export const EditBillingAdjustmentsDialog: FunctionComponent = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(billingAdjustmentSchema),
    defaultValues: {
      name: "",
      percentage: 0,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = form;

  const selectedBillAdjustment = useBillingAdjustmentsStore((state) => state.selectedBillAdjustment);

  const editBillingAdjustmentsDialogIsOpen = useBillingAdjustmentsStore(
    (state) => state.editBillingAdjustmentsDialogIsOpen,
  );
  const setEditBillingAdjustmentsDialogIsOpen = useBillingAdjustmentsStore(
    (state) => state.setEditBillingAdjustmentsDialogIsOpen,
  );

  const refetch = useBillingAdjustmentsStore((state) => state.refetch);

  useEffect(() => {
    if (editBillingAdjustmentsDialogIsOpen && selectedBillAdjustment) {
      setValue("id", selectedBillAdjustment.id!);
      setValue("name", selectedBillAdjustment.name);
      setValue("percentage", selectedBillAdjustment.percentage);
    }
  }, [editBillingAdjustmentsDialogIsOpen]);

  const patchBillingAdjustmentsMutation = useMutation({
    mutationKey: ["edit-new-billing-adjustments"],
    mutationFn: async (data: BillingAdjustment) => {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_MR_BE}/billing-adjustments/${data.id}`, {
        name: data.name,
        percentage: data.percentage,
      });
      return res.data;
    },
    onSuccess: async () => {
      toast.success("Success", {
        description: `You have successfully updated this billing adjustment!`,
        position: "top-right",
      });
      reset();
      refetch?.();
      setEditBillingAdjustmentsDialogIsOpen(false);
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message,
        position: "top-right",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    patchBillingAdjustmentsMutation.mutate(data);
  };

  return (
    <Dialog
      open={editBillingAdjustmentsDialogIsOpen}
      onOpenChange={() => {
        setEditBillingAdjustmentsDialogIsOpen(!editBillingAdjustmentsDialogIsOpen);
      }}
      modal
    >
      <DialogContent className="max-w-md rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-semibold dark:text-white">
            Edit Billing Adjustment
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
                disabled={patchBillingAdjustmentsMutation.isPending}
              >
                {patchBillingAdjustmentsMutation.isPending ? "Saving..." : "Apply Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
