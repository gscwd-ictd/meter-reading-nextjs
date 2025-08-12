"use client";

import { FunctionComponent, Suspense, useEffect } from "react";
import { DataTable } from "@mr/components/ui/data-table/data-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUserAccountsColumns } from "./UserAccountsColumns";
import { useUserAccountsStore } from "@mr/components/stores/useUserAccountsStore";

export const UserAccountsDataTable: FunctionComponent = () => {
  const userAccounts = useUserAccountsStore((state) => state.users);
  const setUserAccounts = useUserAccountsStore((state) => state.setUsers);

  const { data, isLoading } = useQuery({
    queryKey: ["get-all-users"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/meter-readers?status=assigned`);

      return res.data;
    },
  });

  const userAccountsColumns = useUserAccountsColumns(userAccounts);

  useEffect(() => {
    if (data) {
      setUserAccounts(data);
      // setRefetchZonebooks(refetch);
    }
  }, [data, setUserAccounts]);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DataTable data={userAccounts ? userAccounts : []} columns={userAccountsColumns} loading={isLoading} />
    </Suspense>
  );
};
