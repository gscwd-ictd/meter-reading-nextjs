// "use client";

// import { ColumnDef, FilterFn } from "@tanstack/react-table";
// import { useEffect, useState } from "react";
// import { Checkbox } from "@mr/components/ui/Checkbox";
// import {
//   ReadingDetails as BatchPostColumn,
//   ReadingDetailsStatus,
// } from "@mr/lib/types/text-blast/ReadingDetails";
// import { useBatchPostStore } from "@mr/components/stores/useBatchPostStore";
// import { format } from "date-fns";
// import { Button } from "@mr/components/ui/Button";
// import { Eye } from "lucide-react";
// import { Badge } from "@mr/components/ui/Badge";

// export const useBatchPostColumns = (
//   data: BatchPostColumn[] | undefined,
//   handleViewDetails: (row: BatchPostColumn) => void,
// ) => {
//   const [batchPostColumns, setBatchPostColumns] = useState<ColumnDef<BatchPostColumn>[]>([]);

//   const dateFilterFn: FilterFn<BatchPostColumn> = (row, columnId, value) => {
//     const rowValue = row.getValue(columnId) as string;
//     if (!rowValue || !value) return true;

//     const rowDate = new Date(rowValue);
//     const filterDate = new Date(value);

//     return (
//       rowDate.getFullYear() === filterDate.getFullYear() &&
//       rowDate.getMonth() === filterDate.getMonth() &&
//       rowDate.getDate() === filterDate.getDate()
//     );
//   };

//   const { selectedConsumers, addSelectedConsumer, removeSelectedConsumer } = useBatchPostStore();

//   useEffect(() => {
//     const cols: ColumnDef<BatchPostColumn>[] = [
//       {
//         id: "select",
//         header: ({ table }) => (
//           <Checkbox
//             checked={table.getIsAllPageRowsSelected()}
//             onCheckedChange={(value) => {
//               table.toggleAllPageRowsSelected(!!value);
//               if (value) {
//                 table.getRowModel().rows.forEach((row) => {
//                   if (!selectedConsumers.some((r) => r.accountNumber === row.original.accountNumber)) {
//                     addSelectedConsumer(row.original);
//                   }
//                 });
//               } else {
//                 table.getRowModel().rows.forEach((row) => {
//                   removeSelectedConsumer(row.original.accountNumber);
//                 });
//               }
//             }}
//             aria-label="Select all"
//           />
//         ),
//         cell: ({ row }) => (
//           <Checkbox
//             checked={row.getIsSelected()}
//             onCheckedChange={(value) => {
//               row.toggleSelected(!!value);
//               if (value) {
//                 addSelectedConsumer(row.original);
//               } else {
//                 removeSelectedConsumer(row.original.accountNumber);
//               }
//             }}
//             aria-label="Select row"
//           />
//         ),
//         enableSorting: false,
//         enableHiding: false,
//       },
//       {
//         accessorKey: "accountNumber",
//         header: "Account No.",
//         enableColumnFilter: false,
//       },
//       {
//         accessorKey: "accountName",
//         header: "Account Name",
//         enableColumnFilter: false,
//       },
//       {
//         accessorKey: "readingDate",
//         header: "Reading Date",
//         cell: ({ row }) => {
//           return format(row.getValue("readingDate"), "MM/dd/yyyy");
//         },
//         enableColumnFilter: true,
//         filterFn: dateFilterFn,
//         meta: {
//           exportLabel: "Reading Date",
//         },
//       },
//       {
//         accessorKey: "billedAmount",
//         header: "Billed Amount",
//         cell: ({ row }) => {
//           const amount = parseFloat(row.getValue("billedAmount"));
//           return new Intl.NumberFormat("en-PH", {
//             style: "currency",
//             currency: "PHP",
//           }).format(amount);
//         },
//         enableColumnFilter: false,
//       },
//       {
//         accessorKey: "status",
//         header: "Status",
//         cell: ({ row }) => {
//           const status = row.getValue("status");
//           return status === ReadingDetailsStatus.POSTED ? (
//             <Badge variant={"default"} className="w-20">
//               Posted
//             </Badge>
//           ) : (
//             <Badge variant={"outline"} className="w-20">
//               Not Posted
//             </Badge>
//           );
//         },
//         enableColumnFilter: false,
//       },
//       {
//         id: "actions",
//         header: "Actions",
//         cell: ({ row }) => (
//           <Button onClick={() => handleViewDetails(row.original)}>
//             <Eye />
//           </Button>
//         ),
//       },
//     ];

//     setBatchPostColumns(cols);
//   }, [data, addSelectedConsumer, removeSelectedConsumer, selectedConsumers, handleViewDetails]);

//   return batchPostColumns;
// };
