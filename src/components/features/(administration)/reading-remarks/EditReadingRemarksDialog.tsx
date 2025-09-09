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
} from "@mr/components/ui/Dialog";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@mr/components/ui/Button";
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
  isZeroConsumption: z.boolean(),
  isNegativeConsumption: z.boolean(),
});

type FormValues = z.infer<typeof readingRemarksSchema>;

type EditReadingRemarksDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  readingRemark: ReadingRemark | null;
};

export const EditReadingRemarksDialog: FunctionComponent<EditReadingRemarksDialogProps> = ({
  open,
  setOpen,
  readingRemark,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(readingRemarksSchema),
    defaultValues: {
      name: "",
      isAverage: false,
      isActive: true,
      isNegativeConsumption: false,
      isZeroConsumption: false,
    },
  });

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = form;

  // Watch the values of the three consumption toggles
  const isAverage = watch("isAverage");
  const isZeroConsumption = watch("isZeroConsumption");
  const isNegativeConsumption = watch("isNegativeConsumption");

  // Effect to ensure only one consumption type is selected at a time
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // Only run this logic when one of the consumption toggles changes
      if (
        name &&
        ["isAverage", "isZeroConsumption", "isNegativeConsumption"].includes(name) &&
        type === "change"
      ) {
        // If the changed field is being set to true, set the others to false
        if (value[name as keyof FormValues] === true) {
          if (name === "isAverage") {
            setValue("isZeroConsumption", false);
            setValue("isNegativeConsumption", false);
          } else if (name === "isZeroConsumption") {
            setValue("isAverage", false);
            setValue("isNegativeConsumption", false);
          } else if (name === "isNegativeConsumption") {
            setValue("isAverage", false);
            setValue("isZeroConsumption", false);
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const refetch = useReadingRemarksStore((state) => state.refetch);

  // Set form values when readingRemark changes
  useEffect(() => {
    if (readingRemark) {
      reset({
        name: readingRemark.name || "",
        isAverage: readingRemark.isAverage || false,
        isActive: readingRemark.isActive !== undefined ? readingRemark.isActive : true,
        isNegativeConsumption: readingRemark.isNegativeConsumption || false,
        isZeroConsumption: readingRemark.isZeroConsumption || false,
      });
    }
  }, [readingRemark, reset]);

  const updateReadingRemarksMutation = useMutation({
    mutationKey: ["update-reading-remarks", readingRemark?.id],
    mutationFn: async (data: FormValues) => {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_MR_BE}/reading-remarks/${readingRemark?.id}`, {
        name: data.name,
        isAverage: data.isAverage,
        isActive: data.isActive,
        isNegativeConsumption: data.isNegativeConsumption,
        isZeroConsumption: data.isZeroConsumption,
      });
      return res.data;
    },
    onSuccess: async () => {
      toast.success("Success", {
        description: "Reading remark updated successfully!",
        position: "top-right",
      });
      reset();
      refetch?.();
      setOpen(false);
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to update reading remark.";
        toast.error(message, { position: "top-right", duration: 1500 });
      } else {
        toast.error("An unexpected error occurred", { position: "top-right" });
      }
    },
  });

  const onSubmit = (data: FormValues) => {
    if (readingRemark) {
      updateReadingRemarksMutation.mutate(data);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal>
      <DialogContent className="max-w-md space-y-6 rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-semibold dark:text-white">
            Edit Reading Remark
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Update the remark details and settings. Only one consumption type can be selected.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
            {/* Remark name */}
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Remark Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter remark name" {...field} />
                  </FormControl>
                  <FormDescription className="text-muted-foreground text-xs">
                    Update the remark name.
                  </FormDescription>
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </FormItem>
              )}
            />

            {/* Consumption-related toggles */}
            <div className="space-y-0 rounded-lg border p-4">
              <h3 className="text-foreground text-sm font-medium">Consumption Settings</h3>
              <p className="text-muted-foreground mb-2 text-xs">
                Configure how this remark affects consumption calculations. Only one can be selected.
              </p>

              {/* Average toggle */}
              <FormField
                control={control}
                name="isAverage"
                render={({ field }) => (
                  <FormItem className="hover:bg-muted/50 flex items-center justify-between rounded-lg p-3 transition">
                    <div>
                      <FormLabel className="font-medium">Average</FormLabel>
                      <FormDescription className="text-muted-foreground text-xs">
                        Automatically compute the average consumption?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            // This will automatically uncheck the others via the useEffect
                            field.onChange(checked);
                          } else {
                            // Allow unchecking without affecting others
                            field.onChange(checked);
                          }
                        }}
                        disabled={!field.value && (isZeroConsumption || isNegativeConsumption)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Zero Consumption toggle */}
              <FormField
                control={form.control}
                name="isZeroConsumption"
                render={({ field }) => (
                  <FormItem className="hover:bg-muted/50 flex items-center justify-between rounded-lg p-3 transition">
                    <div>
                      <FormLabel className="font-medium">Zero</FormLabel>
                      <FormDescription className="text-muted-foreground text-xs">
                        Does it have a zero consumption?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange(checked);
                          } else {
                            field.onChange(checked);
                          }
                        }}
                        disabled={!field.value && (isAverage || isNegativeConsumption)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Negative Consumption toggle */}
              <FormField
                control={form.control}
                name="isNegativeConsumption"
                render={({ field }) => (
                  <FormItem className="hover:bg-muted/50 flex items-center justify-between rounded-lg p-3 transition">
                    <div>
                      <FormLabel className="font-medium">Negative</FormLabel>
                      <FormDescription className="text-muted-foreground text-xs">
                        Does it have a negative consumption?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange(checked);
                          } else {
                            field.onChange(checked);
                          }
                        }}
                        disabled={!field.value && (isAverage || isZeroConsumption)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Status section - visually separated */}
            <div className="space-y-0 rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
              <h3 className="text-foreground text-sm font-medium">Status</h3>
              <p className="text-muted-foreground mb-2 text-xs">Control the active state of this remark.</p>

              {/* Active toggle */}
              <FormField
                control={control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg p-3 transition hover:bg-blue-100/50 dark:hover:bg-blue-900/30">
                    <div>
                      <FormLabel className="font-medium text-blue-700 dark:text-blue-300">Active</FormLabel>
                      <FormDescription className="text-muted-foreground text-xs">
                        Set this remark as active or inactive.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Footer */}
            <DialogFooter className="flex justify-center space-x-2">
              <Button
                type="submit"
                disabled={updateReadingRemarksMutation.isPending || !readingRemark}
                className="mt-2 w-full px-6 dark:text-white"
              >
                {updateReadingRemarksMutation.isPending ? "Updating..." : "Update Remark"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
