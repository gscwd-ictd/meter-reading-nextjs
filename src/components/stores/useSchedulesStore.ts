import { MeterReader } from "@/lib/types/personnel";
import { MeterReadingSchedule } from "@/lib/types/schedule";
import { Zonebook } from "@/lib/types/zonebook";
import { create } from "zustand";

type SchedulesStore = {
  schedule: MeterReadingSchedule[];
  setSchedule: (schedule: MeterReadingSchedule[]) => void;
  calendarIsSet: boolean;
  setCalendarIsSet: (calendarIsSet: boolean) => void;
  selectedScheduleEntry: MeterReadingSchedule | null;
  setSelectedScheduleEntry: (selectedScheduleEntry: MeterReadingSchedule | null) => void;
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
};

export const useSchedulesStore = create<SchedulesStore>((set) => ({
  schedule: [],
  setSchedule: (schedule) => set({ schedule }),
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
}));
