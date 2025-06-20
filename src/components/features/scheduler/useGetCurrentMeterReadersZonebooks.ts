import { MeterReaderWithDesignatedZonebooks } from "@mr/lib/types/personnel";
import { MeterReadingEntryWithZonebooks } from "@mr/lib/types/schedule";
import { ZonebookWithDates } from "@mr/lib/types/zonebook";

export const useGetCurrentMeterReadersZonebooks = () => {
  // set the default zoneBooks for the month
  const defaultZonebooks = (
    schedule: MeterReadingEntryWithZonebooks[],
  ): MeterReaderWithDesignatedZonebooks[] => {
    const map = new Map<string, MeterReaderWithDesignatedZonebooks>();

    for (const entry of schedule) {
      if (!entry.meterReaders) continue;

      for (const reader of entry.meterReaders) {
        // Skip if no zoneBooks
        if (!reader.zoneBooks || reader.zoneBooks.length === 0) continue;

        const key = `${reader.meterReaderId}-${reader.companyId}-${reader.assignment}`;

        // name: reader.name,
        // companyId: reader.companyId,
        // assignment: reader.assignment,
        // mobileNumber: reader.mobileNumber,
        // positionTitle: reader.positionTitle,
        // photoUrl: reader.photoUrl,
        if (!map.has(key)) {
          map.set(key, {
            meterReaderId: reader.meterReaderId!,
            zoneBooks: {
              assigned: [],
              unassigned: [...reader.zoneBooks],
            },
          });
        } else {
          const existing = map.get(key)!;
          existing.zoneBooks.unassigned.push(...reader.zoneBooks);
        }
      }
    }

    // Optionally deduplicate zoneBooks per reader
    return Array.from(map.values()).map((reader) => ({
      ...reader,
      zoneBooks: {
        assigned: dedupeZonebooks(reader.zoneBooks.assigned),
        unassigned: dedupeZonebooks(reader.zoneBooks.unassigned),
      },
    }));
  };

  // get the current zoneBooks for the month
  const currentZonebooks = (
    schedule: MeterReadingEntryWithZonebooks[],
    defaults: MeterReaderWithDesignatedZonebooks[],
  ) => {
    const map = new Map<string, MeterReaderWithDesignatedZonebooks>();

    // alias entry to schedule
    for (const entry of schedule) {
      if (!entry.meterReaders) continue;

      for (const reader of entry.meterReaders) {
        // Skip if no zoneBooks
        if (!reader.zoneBooks || reader.zoneBooks.length === 0) continue;

        const key = `${reader.meterReaderId}`;

        if (!map.has(key)) {
          map.set(key, {
            meterReaderId: reader.meterReaderId!,
            zoneBooks: {
              assigned: [...reader.zoneBooks],
              unassigned: [],
            },
          });
        } else {
          const existing = map.get(key)!;
          existing.zoneBooks.assigned.push(...reader.zoneBooks);
        }
      }
    }

    // Optionally deduplicate zoneBooks per reader
    const current = Array.from(map.values()).map((reader) => ({
      ...reader,
      zoneBooks: {
        assigned: dedupeZonebooks(reader.zoneBooks.assigned),
        unassigned: dedupeZonebooks(reader.zoneBooks.unassigned),
      },
    }));

    // Step 2: Reconstruct final result from defaults
    return defaults.map((defaultReader) => {
      const matchedReader = current.find((c) => c.meterReaderId === defaultReader.meterReaderId);

      const assigned = matchedReader?.zoneBooks.assigned ?? [];

      // Zonebooks from default unassigned not yet assigned
      const unassignedFromDefault = defaultReader.zoneBooks.unassigned.filter(
        (zb) => !assigned.some((a) => a.zoneBook === zb.zoneBook),
      );

      // Zonebooks from default previously assigned but now missing → push back to unassigned
      const missingFromPreviousAssigned = defaultReader.zoneBooks.assigned.filter(
        (zb) => !assigned.some((a) => a.zoneBook === zb.zoneBook),
      );

      const unassigned = dedupeZonebooks([...unassignedFromDefault, ...missingFromPreviousAssigned]);

      return {
        meterReaderId: defaultReader.meterReaderId,
        zoneBooks: {
          assigned,
          unassigned,
        },
      };
    });
  };

  const dedupeZonebooks = (zoneBooks: ZonebookWithDates[]): ZonebookWithDates[] => {
    const seen = new Set<string>();
    const result: ZonebookWithDates[] = [];

    for (const zb of zoneBooks) {
      const key = zb.zoneBook; // you can enhance this with more fields if needed
      if (!seen.has(key)) {
        seen.add(key);
        result.push(zb);
      }
    }

    return result;
  };

  return { defaultZonebooks, currentZonebooks };
};
