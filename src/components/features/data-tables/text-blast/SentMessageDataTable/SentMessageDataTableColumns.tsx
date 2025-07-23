"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { TextMessage as SentMessageColumn } from "@mr/lib/types/text-blast/TextMessage";

export const useSentMessageColumns = () => {
  const columns = useMemo(
    () =>
      [
        {
          accessorKey: "contactNumber",
          header: "Contact No.",
        },
        {
          accessorKey: "accountNumber",
          header: "Account No.",
        },
        {
          accessorKey: "consumerName",
          header: "Account Name",
        },
      ] satisfies ColumnDef<SentMessageColumn>[],
    [],
  );

  return columns;
};
