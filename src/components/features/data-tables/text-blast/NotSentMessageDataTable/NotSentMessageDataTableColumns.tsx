"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { TextMessage as NotSentMessageColumn } from "@mr/lib/types/text-blast/TextMessage";

export const useNotSentMessageColumns = () => {
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
      ] satisfies ColumnDef<NotSentMessageColumn>[],
    [],
  );

  return columns;
};
