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
import { Label } from "@radix-ui/react-label";
import { Input } from "@mr/components/ui/Input";

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(billingAdjustmentSchema),
    defaultValues: {
      name: "",
      percentage: 0,
    },
  });

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
    onError: (error) => {
      toast.error("Error", {
        description: error.message,
        position: "top-right",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    postBillingAdjustmentsMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogTrigger asChild className="w-full sm:w-full md:w-full lg:w-fit">
        <Button variant="default" className="dark:text-white">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add Billing Adjustments
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-semibold">Add Billing Adjustment</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Enter a name and its equivalent percentage.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter billing adjustment name" {...register("name")} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="percentage">Percentage</Label>
            <Input
              id="percentage"
              placeholder="Enter percentage (0-100)"
              type="number"
              step="0.01"
              {...register("percentage", { valueAsNumber: true })}
            />
            {errors.percentage && <p className="text-sm text-red-500">{errors.percentage.message}</p>}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="mt-4 h-[3rem] w-full"
              disabled={postBillingAdjustmentsMutation.isPending}
            >
              {postBillingAdjustmentsMutation.isPending ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
