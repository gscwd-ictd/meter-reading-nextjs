"use client";

import { SimpleDataTable } from "@mr/components/ui/simple-data-table/SimpleDataTable";
import { useUnbilledColumns } from "./UnbilledColumns";
import { UnbilledAccount } from "@mr/lib/types/accounts";
import { FunctionComponent, ReactNode, useState } from "react";

type UnbilledDataTableProps = {
  data: UnbilledAccount[];
  header?: ReactNode | ReactNode[];
  footer?: ReactNode | ReactNode[];
};

export const UnbilledDataTable: FunctionComponent<UnbilledDataTableProps> = ({ data, header, footer }) => {
  const [UnbilledAccounts] = useState<UnbilledAccount[]>([]);

  const unbilledAccountColumns = useUnbilledColumns(UnbilledAccounts);

  return (
    <SimpleDataTable columns={unbilledAccountColumns} data={data} title="" header={header} footer={footer} />
  );
};
