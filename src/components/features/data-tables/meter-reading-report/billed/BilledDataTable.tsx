"use client";

import { SimpleDataTable } from "@mr/components/ui/simple-data-table/SimpleDataTable";
import { useBilledColumns } from "./BilledColumns";
import { BilledAccount } from "@mr/lib/types/accounts";
import { FunctionComponent, ReactNode, useState } from "react";

type BilledDataTableProps = {
  data: BilledAccount[];
  header?: ReactNode | ReactNode[];
  footer?: ReactNode | ReactNode[];
};

export const BilledDataTable: FunctionComponent<BilledDataTableProps> = ({ data, header, footer }) => {
  const [billedAccounts] = useState<BilledAccount[]>([]);

  const billedAccountColumns = useBilledColumns(billedAccounts);

  return (
    <SimpleDataTable columns={billedAccountColumns} data={data} title="" header={header} footer={footer} />
  );
};
