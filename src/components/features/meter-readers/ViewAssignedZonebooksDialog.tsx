import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@mr/components/ui/Dialog";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@mr/components/ui/Skeleton";
import { Zonebook } from "@mr/lib/types/zonebook";
import { EyeIcon } from "lucide-react";

// Types
interface MeterReader {
  meterReaderId: string;
  fullName?: string;
  [key: string]: any;
}

interface ViewAssignedZonebooksDialogProps {
  meterReader: MeterReader;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Placeholder fetch function
const fetchMeterReaderDetails = async (meterReaderId: string) => {
  // Simulate API delay
  await new Promise((res) => setTimeout(res, 500));
  return {
    meterReaderId,
    name: "Juan Dela Cruz",
    zoneBooks: [
      {
        zone: "Z01",
        book: "B01",
        zoneBook: "Z01-B01",
        area: "Downtown",
      },
      {
        zone: "Z02",
        book: "B03",
        zoneBook: "Z02-B03",
        area: "Uptown",
      },
    ] as Zonebook[],
  };
};

export const ViewAssignedZonebooksDialog: React.FC<ViewAssignedZonebooksDialogProps> = ({
  meterReader,
  open,
  onOpenChange,
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["meterReaderDetails", meterReader.meterReaderId],
    queryFn: () => fetchMeterReaderDetails(meterReader.meterReaderId),
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="flex w-full items-center justify-start gap-2 rounded p-2 text-sm hover:bg-amber-400">
          <EyeIcon className="size-4" />
          View Assigned Zonebooks
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assigned Zonebooks</DialogTitle>
          <p className="text-muted-foreground text-sm">
            Meter Reader:{" "}
            <span className="font-medium">{meterReader.fullName || meterReader.meterReaderId}</span>
          </p>
        </DialogHeader>

        <div className="mt-4 space-y-2">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </>
          ) : (
            data?.zoneBooks?.map((zb, index) => (
              <div key={index} className="rounded-md border p-3 text-sm shadow-sm">
                <p className="font-medium">{zb.zoneBook}</p>
                <p className="text-muted-foreground">
                  Zone: {zb.zone} | Book: {zb.book}
                </p>
                <p className="text-muted-foreground">Area: {zb.area}</p>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
