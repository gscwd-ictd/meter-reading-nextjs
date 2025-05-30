"use client";

import { create } from "zustand";
import { Employee, MeterReader } from "@mr/lib/types/personnel";

type MeterReadersStore = {
  meterReaders: MeterReader[];
  setMeterReaders: (meterReaders: MeterReader[]) => void;
  selectedMeterReader: MeterReader | undefined;
  setSelectedMeterReader: (selectedMeterReader: MeterReader | undefined) => void;

  selectedRestDay: "sunday" | "saturday" | undefined;
  setSelectedRestDay: (selectedRestDay: "sunday" | "saturday" | undefined) => void;

  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;

  selectedEmployee: Employee | undefined;
  setSelectedEmployee: (selectedEmployee: Employee | undefined) => void;

  addMeterReadersDialogIsOpen: boolean;
  setAddMeterReadersDialogIsOpen: (addMeterReadersDialogIsOpen: boolean) => void;

  editMeterReadersDialogIsOpen: boolean;
  setEditMeterReadersDialogIsOpen: (editPersonnelDialogIsOpen: boolean) => void;

  queryPersonnel: string;
  setQueryPersonnel: (queryPersonnel: string) => void;
};

export const useMeterReadersStore = create<MeterReadersStore>((set) => ({
  meterReaders: [],
  setMeterReaders: (meterReaders) => set({ meterReaders }),

  selectedMeterReader: undefined,
  setSelectedMeterReader: (selectedMeterReader) => set({ selectedMeterReader }),

  addMeterReadersDialogIsOpen: false,
  setAddMeterReadersDialogIsOpen: (addMeterReadersDialogIsOpen) => set({ addMeterReadersDialogIsOpen }),

  editMeterReadersDialogIsOpen: false,
  setEditMeterReadersDialogIsOpen: (editMeterReadersDialogIsOpen) => set({ editMeterReadersDialogIsOpen }),

  employees: [],
  setEmployees: (employees) => set({ employees }),

  selectedEmployee: undefined,
  setSelectedEmployee: (selectedEmployee) => set({ selectedEmployee }),

  selectedRestDay: undefined,
  setSelectedRestDay: (selectedRestDay: "sunday" | "saturday" | undefined) => set({ selectedRestDay }),

  queryPersonnel: "",
  setQueryPersonnel: (queryPersonnel) => set({ queryPersonnel }),
}));
