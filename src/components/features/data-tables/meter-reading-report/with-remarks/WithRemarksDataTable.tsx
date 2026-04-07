"use client";

import { SimpleDataTable } from "@mr/components/ui/simple-data-table/SimpleDataTable";
import { useWithRemarksColumns } from "./WithRemarksColumns";
import { WithRemarksAccount } from "@mr/lib/types/accounts";
import { FunctionComponent, ReactNode, useState } from "react";

type WithRemarksDataTableProps = {
  data: WithRemarksAccount[];
  header?: ReactNode | ReactNode[];
  footer?: ReactNode | ReactNode[];
};

export const WithRemarksDataTable: FunctionComponent<WithRemarksDataTableProps> = ({
  data,
  header,
  footer,
}) => {
  const [withRemarksAccounts] = useState<WithRemarksAccount[]>([]);

  const withRemarksAccountColumns = useWithRemarksColumns(withRemarksAccounts);

  return (
    <SimpleDataTable
      columns={withRemarksAccountColumns}
      data={data}
      title=""
      header={header}
      footer={footer}
    />
  );
};
