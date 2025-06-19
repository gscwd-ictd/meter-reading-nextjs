import { MeterReaderWithDesignatedZonebooks } from "@mr/lib/types/personnel";
import { MeterReadingEntryWithZonebooks } from "@mr/lib/types/schedule";
import { ZonebookWithDates } from "@mr/lib/types/zonebook";

export const useGetCurrentMeterReadersZonebooks = () => {
  // set the default zonebooks for the month
  const defaultZonebooks = (
    schedule: MeterReadingEntryWithZonebooks[],
  ): MeterReaderWithDesignatedZonebooks[] => {
    const map = new Map<string, MeterReaderWithDesignatedZonebooks>();

    for (const entry of schedule) {
      if (!entry.meterReaders) continue;

      for (const reader of entry.meterReaders) {
        // Skip if no zonebooks
        if (!reader.zonebooks || reader.zonebooks.length === 0) continue;

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
            zonebooks: {
              assigned: [],
              unassigned: [...reader.zonebooks],
            },
          });
        } else {
          const existing = map.get(key)!;
          existing.zonebooks.unassigned.push(...reader.zonebooks);
        }
      }
    }

    // Optionally deduplicate zonebooks per reader
    return Array.from(map.values()).map((reader) => ({
      ...reader,
      zonebooks: {
        assigned: dedupeZonebooks(reader.zonebooks.assigned),
        unassigned: dedupeZonebooks(reader.zonebooks.unassigned),
      },
    }));
  };

  // get the current zonebooks for the month
  const currentZonebooks = (
    schedule: MeterReadingEntryWithZonebooks[],
    defaults: MeterReaderWithDesignatedZonebooks[],
  ) => {
    const map = new Map<string, MeterReaderWithDesignatedZonebooks>();

    // alias entry to schedule
    for (const entry of schedule) {
      if (!entry.meterReaders) continue;

      for (const reader of entry.meterReaders) {
        // Skip if no zonebooks
        if (!reader.zonebooks || reader.zonebooks.length === 0) continue;

        const key = `${reader.meterReaderId}`;

        if (!map.has(key)) {
          map.set(key, {
            meterReaderId: reader.meterReaderId!,
            zonebooks: {
              assigned: [...reader.zonebooks],
              unassigned: [],
            },
          });
        } else {
          const existing = map.get(key)!;
          existing.zonebooks.assigned.push(...reader.zonebooks);
        }
      }
    }

    // Optionally deduplicate zonebooks per reader
    const current = Array.from(map.values()).map((reader) => ({
      ...reader,
      zonebooks: {
        assigned: dedupeZonebooks(reader.zonebooks.assigned),
        unassigned: dedupeZonebooks(reader.zonebooks.unassigned),
      },
    }));

    // Step 2: Reconstruct final result from defaults
    return defaults.map((defaultReader) => {
      const matchedReader = current.find((c) => c.meterReaderId === defaultReader.meterReaderId);

      const assigned = matchedReader?.zonebooks.assigned ?? [];

      // Zonebooks from default unassigned not yet assigned
      const unassignedFromDefault = defaultReader.zonebooks.unassigned.filter(
        (zb) => !assigned.some((a) => a.zoneBook === zb.zoneBook),
      );

      // Zonebooks from default previously assigned but now missing → push back to unassigned
      const missingFromPreviousAssigned = defaultReader.zonebooks.assigned.filter(
        (zb) => !assigned.some((a) => a.zoneBook === zb.zoneBook),
      );

      const unassigned = dedupeZonebooks([...unassignedFromDefault, ...missingFromPreviousAssigned]);

      return {
        meterReaderId: defaultReader.meterReaderId,
        zonebooks: {
          assigned,
          unassigned,
        },
      };
    });
  };

  const dedupeZonebooks = (zonebooks: ZonebookWithDates[]): ZonebookWithDates[] => {
    const seen = new Set<string>();
    const result: ZonebookWithDates[] = [];

    for (const zb of zonebooks) {
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
