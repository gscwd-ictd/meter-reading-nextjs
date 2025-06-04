import { MeterReader } from "@mr/lib/types/personnel";
import { MeterReadingEntry } from "@mr/lib/types/schedule";
import { Zonebook } from "@mr/lib/types/zonebook";
import { create } from "zustand";

type SchedulesStore = {
  currentSchedule: MeterReadingEntry[];
  setCurrentSchedule: (currentSchedule: MeterReadingEntry[]) => void;
  calendarIsSet: boolean;
  setCalendarIsSet: (calendarIsSet: boolean) => void;
  selectedScheduleEntry: MeterReadingEntry | null;
  setSelectedScheduleEntry: (selectedScheduleEntry: MeterReadingEntry | null) => void;
  scheduleEntryDialogIsOpen: boolean;
  setScheduleEntryDialogIsOpen: (scheduleEntryDialogIsOpen: boolean) => void;
  zonebookDialogIsOpen: boolean;
  setZonebookDialogIsOpen: (zonebookDialogIsOpen: boolean) => void;
  selectedMeterReader: MeterReader | null;
  setSelectedMeterReader: (selectedMeterReader: MeterReader | null) => void;
  selectedZonebook: Zonebook | null;
  setSelectedZonebook: (selectedZonebook: Zonebook | null) => void;
  submitSuccessDialogIsOpen: boolean;
  setSubmitSuccessDialogIsOpen: (submitSuccessDialogIsOpen: boolean) => void;
  datesToSplit: Date[];
  setDatesToSplit: (datesToSplit: Date[]) => void;
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
}));
