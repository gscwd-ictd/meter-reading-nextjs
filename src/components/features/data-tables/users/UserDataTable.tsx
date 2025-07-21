"use client";

import { FunctionComponent, Suspense, useEffect, useState } from "react";
import { DataTable } from "@mr/components/ui/data-table/data-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { useUserColumns } from "./UserColumns";
import { useUsersStore } from "@mr/components/stores/useUsersStore";

export const UserDataTable: FunctionComponent = () => {
  const users = useUsersStore((state) => state.users);
  const setUsers = useUsersStore((state) => state.setUsers);

  const { data, refetch } = useQuery({
    queryKey: ["get-all-users"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/meter-readers?status=assigned`);

      return res.data;
    },
  });

  const userColumns = useUserColumns(users);

  useEffect(() => {
    if (data) {
      setUsers(data);
      // setRefetchZonebooks(refetch);
    }
  }, [data, setUsers, refetch]);

  if (!data)
    return (
      <div className="text-primary flex h-full w-full items-center justify-center gap-2">
        <LoadingSpinner size={50} /> Loading Zonebooks...
      </div>
    );
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DataTable data={users ? users : []} columns={userColumns} />
    </Suspense>
  );
};
