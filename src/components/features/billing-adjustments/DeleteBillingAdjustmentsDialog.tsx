import { useBillingAdjustmentsStore } from "@mr/components/stores/useBillingAdjustmentsStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@mr/components/ui/AlertDialog";
import { BillingAdjustment } from "@mr/lib/types/billing-adjustment";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { TrashIcon } from "lucide-react";
import { FunctionComponent, useState } from "react";
import { toast } from "sonner";

type DeleteBillingAdjustmentsDialogProps = {
  details: BillingAdjustment;
};

export const DeleteBillingAdjustmentsDialog: FunctionComponent<DeleteBillingAdjustmentsDialogProps> = ({
  details,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const refetch = useBillingAdjustmentsStore((state) => state.refetch);

  const deleteAreaMutation = useMutation({
    mutationFn: async (details: BillingAdjustment) => {
      try {
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_MR_BE}/billing-adjustment/${details.id}`);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: async () => {
      toast.success("Success", {
        description: `Successfully Removed ${details.name} from the list of billing adjustments!`,
        position: "top-right",
        duration: 1500,
      });

      refetch!();

      setOpen(false);
    },
    onError: () => {
      toast.error("Error", {
        description: `Cannot remove ${details.name}. Something went wrong. Please try again later`,
        position: "top-right",
        duration: 1500,
      });
    },
  });

  return (
    <AlertDialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
      }}
    >
      <AlertDialogTrigger asChild>
        <button className="text-primary size-8 rounded bg-blue-100 p-2 hover:cursor-pointer hover:brightness-90">
          <TrashIcon className="size-4" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete meter reader</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to remove <span className="text-primary font-bold">{details.name}</span> from the list
            of Billing Adjustments?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-[6rem]">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="w-[6rem] bg-red-600 text-white hover:bg-red-700"
            onClick={() => {
              deleteAreaMutation.mutateAsync(details);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
