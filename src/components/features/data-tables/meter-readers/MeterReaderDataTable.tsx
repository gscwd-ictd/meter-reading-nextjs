"use client";

import { FunctionComponent, Suspense } from "react";
import { DataTable } from "@mr/components/ui/data-table/data-table";
import { useMeterReaderColumns } from "./MeterReaderColumns";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { MeterReader } from "@mr/lib/types/personnel";

type MeterReaderDataTableProps = {
  meterReaders: MeterReader[];
};

export const MeterReaderDataTable: FunctionComponent<MeterReaderDataTableProps> = ({ meterReaders }) => {
  // const [meterReaders, setMeterReaders] = useState<MeterReader[]>([]);

  const selectedScheduleEntry = useSchedulesStore((state) => state.selectedScheduleEntry);

  const meterReaderColumns = useMeterReaderColumns(selectedScheduleEntry?.meterReaders);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DataTable data={meterReaders ? meterReaders : []} columns={meterReaderColumns} />
    </Suspense>
  );
};
