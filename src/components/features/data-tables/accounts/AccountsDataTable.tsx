"use client";

import { FunctionComponent, Suspense, useEffect, useState } from "react";
import { DataTable } from "@mr/components/ui/data-table/data-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AccountDetails } from "@mr/lib/types/accounts";
import { useAccountsColumns } from "./AccountsColumns";
import { useZonebookProgressStore } from "@mr/components/stores/useZonebookProgressStore";
import { useAccountsStore } from "@mr/components/stores/useAccountsStore";

export const AccountsDataTable: FunctionComponent = () => {
  const [accounts, setAccounts] = useState<AccountDetails[]>([]);

  const zonebookProgressEntryDialogIsOpen = useZonebookProgressStore(
    (state) => state.zonebookProgressEntryDialogIsOpen,
  );
  const monthYear = useZonebookProgressStore((state) => state.monthYear);
  const selectedZonebookEntry = useZonebookProgressStore((state) => state.selectedZonebookEntry);
  const setAccountDetailsDialogIsOpen = useZonebookProgressStore(
    (state) => state.setAccountDetailsDialogIsOpen,
  );
  const setSelectedAccount = useAccountsStore((state) => state.setSelectedAccount);

  const { data: selectedZonebookWithAccounts, isLoading } = useQuery({
    queryKey: [
      "zonebook-data",
      selectedZonebookEntry.meterReader?.id,
      selectedZonebookEntry.zone,
      selectedZonebookEntry.book,
      monthYear,
    ],
    enabled: selectedZonebookEntry !== null && zonebookProgressEntryDialogIsOpen && !!monthYear,
    queryFn: async () => {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_MR_BE}/progress/zonebooks`, {
        meterReaderId: selectedZonebookEntry.meterReader.id,
        zone: selectedZonebookEntry.zone,
        book: selectedZonebookEntry.book,
        readingMonth: monthYear,
      });

      // const result = res.data as ZonebookProgressWithAccounts;
      return res.data as AccountDetails[];
    },
    retry: 2,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
  });

  const accountsColumn = useAccountsColumns(accounts);

  useEffect(() => {
    if (selectedZonebookWithAccounts) {
      setAccounts(selectedZonebookWithAccounts);
      // setRefetchZonebooks(refetch);
    }
  }, [selectedZonebookWithAccounts, setAccounts]);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DataTable
        data={accounts ? accounts : []}
        columns={accountsColumn}
        loading={isLoading}
        title="Accounts"
        onRowClick={(row) => {
          setSelectedAccount(row.original);
          setAccountDetailsDialogIsOpen(true);
        }}
      />
    </Suspense>
  );
};
