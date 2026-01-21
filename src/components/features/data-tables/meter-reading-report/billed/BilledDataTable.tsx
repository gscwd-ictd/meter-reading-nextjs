"use client";

import { SimpleDataTable } from "@mr/components/ui/simple-data-table/SimpleDataTable";
import { useBilledColumns } from "./BilledColumns";
import { BilledAccount } from "@mr/lib/types/accounts";
import { FunctionComponent, useState } from "react";

type BilledDataTableProps = {
  data: BilledAccount[];
};

export const BilledDataTable: FunctionComponent<BilledDataTableProps> = ({ data }) => {
  const [billedAccounts] = useState<BilledAccount[]>([]);

  const billedAccountColumns = useBilledColumns(billedAccounts);

  return <SimpleDataTable columns={billedAccountColumns} data={data} title="" />;
};
