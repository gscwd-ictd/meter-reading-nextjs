import { MeterReaderWithDesignatedZonebooks, MeterReaderWithZonebooks } from "@mr/lib/types/personnel";
import { MeterReadingEntryWithZonebooks } from "@mr/lib/types/schedule";
import { ZonebookWithDates } from "@mr/lib/types/zonebook";
import { create } from "zustand";

export type SplitDate = {
  dueDate: Date;
  disconnectionDate: Date;
};

type SchedulesStore = {
  currentSchedule: MeterReadingEntryWithZonebooks[];
  setCurrentSchedule: (currentSchedule: MeterReadingEntryWithZonebooks[]) => void;
  calendarIsSet: boolean;
  setCalendarIsSet: (calendarIsSet: boolean) => void;
  selectedScheduleEntry: MeterReadingEntryWithZonebooks | null;
  setSelectedScheduleEntry: (selectedScheduleEntry: MeterReadingEntryWithZonebooks | null) => void;
  scheduleEntryDialogIsOpen: boolean;
  setScheduleEntryDialogIsOpen: (scheduleEntryDialogIsOpen: boolean) => void;
  zonebookDialogIsOpen: boolean;
  setZonebookDialogIsOpen: (zonebookDialogIsOpen: boolean) => void;
  selectedMeterReader: MeterReaderWithZonebooks | null;
  setSelectedMeterReader: (selectedMeterReader: MeterReaderWithZonebooks | null) => void;
  selectedZonebook: ZonebookWithDates | null;
  setSelectedZonebook: (selectedZonebook: ZonebookWithDates | null) => void;
  submitSuccessDialogIsOpen: boolean;
  setSubmitSuccessDialogIsOpen: (submitSuccessDialogIsOpen: boolean) => void;
  datesToSplit: Date[];
  setDatesToSplit: (datesToSplit: Date[]) => void;
  calendarScheduleDropdownIsOpen: boolean;
  setCalendarScheduleDropdownIsOpen: (calendarScheduleDropdownIsOpen: boolean) => void;
  hasSchedule: boolean;
  setHasSchedule: (hasSchedule: boolean) => void;
  entryZonebookSelectorIsOpen: boolean;
  setEntryZonebookSelectorIsOpen: (entryZonebookSelectorIsOpen: boolean) => void;
  meterReaderZonebooks: ZonebookWithDates[];
  setMeterReaderZonebooks: (meterReaderZonebooks: ZonebookWithDates[]) => void;
  scheduleEntryIsSplitted: boolean;
  setScheduleEntryIsSplitted: (scheduleEntryIsSplitted: boolean) => void;
  scheduleHasSplittedDates: boolean;
  setScheduleHasSplittedDates: (scheduleHasSplittedDates: boolean) => void;
  splittedDates: SplitDate[];
  setSplittedDates: (splittedDates: SplitDate[]) => void;
  hasPopulatedMeterReaders: boolean;
  setHasPopulatedMeterReaders: (hasPopulatedMeterReaders: boolean) => void;
  meterReadersWithDesignatedZonebooks: MeterReaderWithDesignatedZonebooks[];
  setMeterReadersWithDesignatedZonebooks: (
    meterReadersWithDesignatedZonebooks: MeterReaderWithDesignatedZonebooks[],
  ) => void;
  tempMeterReadersWithDesignatedZonebooks: MeterReaderWithDesignatedZonebooks[];
  setTempMeterReadersWithDesignatedZonebooks: (
    tempMeterReadersWithDesignatedZonebooks: MeterReaderWithDesignatedZonebooks[],
  ) => void;
};

export const useSchedulesStore = create<SchedulesStore>((set) => ({
  currentSchedule: [],
  setCurrentSchedule: (currentSchedule) => set({ currentSchedule }),
  calendarIsSet: false,
  setCalendarIsSet: (calendarIsSet) => set({ calendarIsSet }),
  selectedScheduleEntry: null,
  setSelectedScheduleEntry: (selectedScheduleEntry) => set({ selectedScheduleEntry }),
  scheduleEntryDialogIsOpen: false,
  setScheduleEntryDialogIsOpen: (scheduleEntryDialogIsOpen) => set({ scheduleEntryDialogIsOpen }),
  zonebookDialogIsOpen: false,
  setZonebookDialogIsOpen: (zonebookDialogIsOpen) => set({ zonebookDialogIsOpen }),
  selectedMeterReader: null,
  setSelectedMeterReader: (selectedMeterReader) => set({ selectedMeterReader }),
  selectedZonebook: null,
  setSelectedZonebook: (selectedZonebook) => set({ selectedZonebook }),
  submitSuccessDialogIsOpen: false,
  setSubmitSuccessDialogIsOpen: (submitSuccessDialogIsOpen) => set({ submitSuccessDialogIsOpen }),
  datesToSplit: [],
  setDatesToSplit: (datesToSplit) => set({ datesToSplit }),
  calendarScheduleDropdownIsOpen: false,
  setCalendarScheduleDropdownIsOpen: (calendarScheduleDropdownIsOpen) =>
    set({ calendarScheduleDropdownIsOpen }),
  hasSchedule: false,
  setHasSchedule: (hasSchedule) => set({ hasSchedule }),
  entryZonebookSelectorIsOpen: false,
  setEntryZonebookSelectorIsOpen: (entryZonebookSelectorIsOpen) => set({ entryZonebookSelectorIsOpen }),
  meterReaderZonebooks: [],
  setMeterReaderZonebooks: (meterReaderZonebooks) => set({ meterReaderZonebooks }),
  scheduleEntryIsSplitted: false,
  setScheduleEntryIsSplitted: (scheduleEntryIsSplitted) => set({ scheduleEntryIsSplitted }),
  splittedDates: [],
  setSplittedDates: (splittedDates) => set({ splittedDates }),
  scheduleHasSplittedDates: false,
  setScheduleHasSplittedDates: (scheduleHasSplittedDates) => set({ scheduleHasSplittedDates }),
  hasPopulatedMeterReaders: false,
  setHasPopulatedMeterReaders: (hasPopulatedMeterReaders) => set({ hasPopulatedMeterReaders }),
  meterReadersWithDesignatedZonebooks: [],
  setMeterReadersWithDesignatedZonebooks: (meterReadersWithDesignatedZonebooks) =>
    set({ meterReadersWithDesignatedZonebooks }),
  tempMeterReadersWithDesignatedZonebooks: [],
  setTempMeterReadersWithDesignatedZonebooks: (tempMeterReadersWithDesignatedZonebooks) =>
    set({ tempMeterReadersWithDesignatedZonebooks }),
}));
