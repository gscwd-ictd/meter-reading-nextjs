"use client";

import { SimpleDataTable } from "@mr/components/ui/simple-data-table/SimpleDataTable";
import { useNewMetersColumns } from "./NewMetersColumns";
import { NewMeterAccount } from "@mr/lib/types/accounts";
import { FunctionComponent, ReactNode, useState } from "react";

type NewMetersDataTableProps = {
  data: NewMeterAccount[];
  header?: ReactNode | ReactNode[];
  footer?: ReactNode | ReactNode[];
};

export const NewMetersDataTable: FunctionComponent<NewMetersDataTableProps> = ({ data, header, footer }) => {
  const [newMetersAccounts] = useState<NewMeterAccount[]>([]);

  const newMetersAccountColumns = useNewMetersColumns(newMetersAccounts);

  return (
    <SimpleDataTable columns={newMetersAccountColumns} data={data} title="" header={header} footer={footer} />
  );
};
