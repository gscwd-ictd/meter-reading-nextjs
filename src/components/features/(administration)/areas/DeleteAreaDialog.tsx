import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
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
import { Area } from "@mr/lib/types/zonebook";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { TrashIcon } from "lucide-react";
import { FunctionComponent, useState } from "react";
import { toast } from "sonner";

type DeleteAreaDialogProps = {
  area: Area;
};

export const DeleteAreaDialog: FunctionComponent<DeleteAreaDialogProps> = ({ area }) => {
  const [open, setOpen] = useState<boolean>(false);

  const refetchAreas = useZonebookStore((state) => state.refetchAreas);

  const deleteAreaMutation = useMutation({
    mutationFn: async (area: Area) => {
      try {
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_MR_BE}/area/${area.id}`);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: async () => {
      toast.success("Success", {
        description: `Successfully Removed ${area.name} from the list of Areas!`,
        position: "top-right",
        duration: 1500,
      });

      refetchAreas!();

      setOpen(false);
    },
    onError: () => {
      toast.error("Error", {
        description: `Cannot remove ${area.name}. Something went wrong. Please try again later`,
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
          <AlertDialogTitle>Delete area</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to remove <span className="text-primary font-bold">{area.name}</span> from the list of
            Areas?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-[6rem]">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="w-[6rem] bg-red-600 text-white hover:bg-red-700"
            onClick={() => {
              deleteAreaMutation.mutateAsync(area);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
