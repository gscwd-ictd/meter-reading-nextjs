import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@mr/components/ui/Dialog";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@mr/components/ui/Skeleton";
import { EyeIcon } from "lucide-react";
import { MeterReader } from "@mr/lib/types/personnel";
import axios from "axios";
import { toast } from "sonner";

interface ViewAssignedZonebooksDialogProps {
  meterReader: MeterReader;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const ViewAssignedZonebooksDialog: React.FC<ViewAssignedZonebooksDialogProps> = ({
  meterReader,
  open,
  setOpen,
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["meterReaderDetails", meterReader.meterReaderId],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_MR_BE}/meter-readers/${meterReader.meterReaderId}`,
        );
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex w-full items-center justify-start gap-2 rounded p-2 text-sm hover:bg-emerald-400">
          <EyeIcon className="size-4" />
          View Assigned Zonebooks
        </button>
      </DialogTrigger>
      <DialogContent className="flex h-screen w-full max-w-full flex-col overflow-hidden p-0 sm:p-0 md:p-6 lg:h-[90vh] lg:!max-w-3xl lg:p-6">
        <DialogHeader>
          <DialogTitle>Assigned Zonebooks</DialogTitle>
          <p className="text-muted-foreground text-sm">
            Meter Reader: <span className="font-medium">{meterReader.name || meterReader.meterReaderId}</span>
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
            <div className="h-full overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted text-muted-foreground sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 text-left">Zonebook</th>
                    <th className="px-4 py-2 text-left">Zone</th>
                    <th className="px-4 py-2 text-left">Book</th>
                    <th className="px-4 py-2 text-left">Area</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.zoneBooks?.map((zb, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 font-medium">{zb.zoneBook}</td>
                      <td className="px-4 py-2">{zb.zone}</td>
                      <td className="px-4 py-2">{zb.book}</td>
                      <td className="px-4 py-2">{zb.area ?? "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
