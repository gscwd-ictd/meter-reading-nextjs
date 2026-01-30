import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@mr/components/ui/Dialog";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@mr/components/ui/Skeleton";
import { EyeIcon } from "lucide-react";
import { MeterReader } from "@mr/lib/types/personnel";
import axios from "axios";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";
import { ViewAssignedZonebooksDataTable } from "../../data-tables/meter-readers/assigned-zonebooks/ViewAssignedZonebooksDataTable";

interface ViewAssignedZonebooksDialogProps {
  meterReader: MeterReader;
  open: boolean;
  setOpen: (open: boolean) => void;
  dropdownIsOpen: boolean;
  setDropdownIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const ViewAssignedZonebooksDialog: React.FC<ViewAssignedZonebooksDialogProps> = ({
  meterReader,
  open,
  setOpen,
  dropdownIsOpen,
  setDropdownIsOpen,
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["meterReaderDetails", meterReader.id],
    queryFn: async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/meter-readers/${meterReader.id}`);
        return res.data as MeterReader;
      } catch (error) {
        console.log(error);
        toast.error("Cannot get zonebooks", {
          description: "A problem has been encountered. Please try again in a few seconds",
          position: "top-right",
        });
      }
    },
    enabled: open,
  });

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        if (open) setDropdownIsOpen(!dropdownIsOpen);
      }}
    >
      <DialogTrigger asChild>
        <button className="flex w-full items-center justify-start gap-2 rounded p-2 text-sm hover:bg-emerald-400">
          <EyeIcon className="size-4" />
          View Assigned Zonebooks
        </button>
      </DialogTrigger>
      <DialogContent className="flex h-screen w-full max-w-full flex-col overflow-hidden p-0 sm:p-0 md:p-6 lg:h-[90vh] lg:!max-w-3xl lg:p-6">
        <DialogHeader>
          <DialogTitle>Assigned Default Zonebooks</DialogTitle>
          <p className="text-muted-foreground text-sm">
            Meter Reader: <span className="font-medium">{meterReader.name || meterReader.id}</span>
          </p>
        </DialogHeader>

        {/* This grows and makes table scrollable */}
        <div className="flex-1 overflow-hidden rounded-md border">
          {isLoading ? (
            <div className="space-y-2 p-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : (
            <ViewAssignedZonebooksDataTable data={data?.zoneBooks ? data.zoneBooks : []} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
