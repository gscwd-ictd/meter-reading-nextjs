"use client";

import { FunctionComponent, Suspense } from "react";
import { DataTable } from "@mr/components/ui/data-table/data-table";
import { useMeterReaderEntryColumns } from "./MeterReaderEntryColumns";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { MeterReaderWithZonebooks } from "@mr/lib/types/personnel";

type MeterReaderDataTableProps = {
  meterReaders: MeterReaderWithZonebooks[];
};

export const MeterReaderEntryDataTable: FunctionComponent<MeterReaderDataTableProps> = ({ meterReaders }) => {
  // const [meterReaders, setMeterReaders] = useState<MeterReader[]>([]);

  const selectedScheduleEntry = useSchedulesStore((state) => state.selectedScheduleEntry);

  const meterReaderEntryColumns = useMeterReaderEntryColumns(selectedScheduleEntry?.meterReaders);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DataTable
        data={meterReaders ? meterReaders.sort((a, b) => (a.name > b.name ? 1 : -1)) : []}
        columns={meterReaderEntryColumns}
        title=""
      />
    </Suspense>
  );
};
