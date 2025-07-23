// "use client";

// import { FunctionComponent, Suspense, useCallback, useState } from "react";
// import { useBatchPostColumns } from "./BatchPostListDataTableColumns";
// import { useBatchPostStore } from "@mr/components/stores/useBatchPostStore";
// import { BatchPostListDataTable } from "./BatchPostListDataTable";
// import { Dialog } from "@mr/components/ui/Dialog";
// import ViewMeterReadingDetails from "@mr/components/features/batch-post/ViewMeterReadingDetails";
// import { Button } from "@mr/components/ui/Button";
// import { toast } from "sonner";
// import { ReadingDetails, ReadingDetailsStatus } from "@mr/lib/types/text-blast/ReadingDetails";

// export const BatchPostListTableComponent: FunctionComponent = () => {
//   const consumers = useBatchPostStore((state) => state.consumers);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedRow, setSelectedRow] = useState<ReadingDetails | null>(null);

//   const selectedConsumers = useBatchPostStore((state) => state.selectedConsumers);
//   const setPostedReadConsumers = useBatchPostStore((state) => state.setPostedReadConsumers);
//   const clearSelectedConsumers = useBatchPostStore((state) => state.clearSelectedConsumers);

//   function handleClick() {
//     if (selectedConsumers.length === 0) {
//       toast.info("Info", { description: "No failed messages to resend" });
//       return;
//     }

//     const posted = selectedConsumers.map((item) => ({
//       ...item,
//       status: ReadingDetailsStatus.POSTED,
//     }));

//     setPostedReadConsumers(posted);
//     clearSelectedConsumers();

//     toast.success("Success", {
//       description: `${posted.length} ${posted.length > 1 ? "accounts" : "account"} successfully posted.`,
//     });
//   }

//   const handleViewDetails = useCallback((row: ReadingDetails) => {
//     setSelectedRow(row);
//     setOpenDialog(true);
//   }, []);

//   const batchPostColumns = useBatchPostColumns(consumers, handleViewDetails);

//   return (
//     <>
//       <Suspense fallback={<p>Loading...</p>}>
//         <BatchPostListDataTable data={consumers ?? []} columns={batchPostColumns} />
//         <Dialog open={openDialog} onOpenChange={setOpenDialog}>
//           <ViewMeterReadingDetails data={selectedRow} />
//         </Dialog>
//         <div className="flex justify-end">
//           <Button onClick={handleClick} disabled={selectedConsumers.length === 0} className="w-fit">
//             Send
//           </Button>
//         </div>
//       </Suspense>
//     </>
//   );
// };
