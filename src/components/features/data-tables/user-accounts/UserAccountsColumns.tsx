"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@mr/components/ui/Avatar";
import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { MeterReader } from "@mr/lib/types/personnel";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { UserAccountsDropdownActions } from "../../user-accounts/UserAccountsDropdownActions";

export const useUserAccountsColumns = (data: MeterReader[]) => {
  const [userAccountsColumns, setUserAccountsColumns] = useState<ColumnDef<MeterReader>[]>([]);

  useEffect(() => {
    const cols: ColumnDef<MeterReader>[] = [
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
        enableColumnFilter: true,
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={
                  row.original.photoUrl
                    ? `${process.env.NEXT_PUBLIC_HRMS_IMAGES_SERVER}/${row.original.photoUrl}`
                    : undefined
                }
                alt={row.original.name}
                className="object-cover"
              />
              <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {row.original.name}
          </span>
        ),
        meta: { exportLabel: "Name" },
      },
      {
        accessorKey: "mobileNumber",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Contact Number" />,
        cell: ({ row }) => <span>{row.original.mobileNumber}</span>,
        meta: { exportLabel: "Contact Number" },
      },
      {
        accessorKey: "companyId",
        header: "Actions",
        cell: ({ row }) => <UserAccountsDropdownActions meterReader={row.original} />,
      },
    ];

    setUserAccountsColumns(cols);
  }, [data]);

  return userAccountsColumns;
};
