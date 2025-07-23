"use client";

import { create } from "zustand";
import { Employee, MeterReader } from "@mr/lib/types/personnel";

type PersonnelStore = {
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

  addPersonnelDialogIsOpen: boolean;
  setAddPersonnelDialogIsOpen: (addPersonnelDialogIsOpen: boolean) => void;
  editPersonnelDialogIsOpen: boolean;
  setEditPersonnelDialogIsOpen: (editPersonnelDialogIsOpen: boolean) => void;

  queryPersonnel: string;
  setQueryPersonnel: (queryPersonnel: string) => void;
};

export const usePersonnelStore = create<PersonnelStore>((set) => ({
  meterReaders: [],
  setMeterReaders: (meterReaders) => set({ meterReaders }),

  selectedMeterReader: undefined,
  setSelectedMeterReader: (selectedMeterReader) => set({ selectedMeterReader }),

  addPersonnelDialogIsOpen: false,
  setAddPersonnelDialogIsOpen: (addPersonnelDialogIsOpen) => set({ addPersonnelDialogIsOpen }),

  editPersonnelDialogIsOpen: false,
  setEditPersonnelDialogIsOpen: (editPersonnelDialogIsOpen) => set({ editPersonnelDialogIsOpen }),

  employees: [],
  setEmployees: (employees) => set({ employees }),

  selectedEmployee: undefined,
  setSelectedEmployee: (selectedEmployee) => set({ selectedEmployee }),

  selectedRestDay: undefined,
  setSelectedRestDay: (selectedRestDay: "sunday" | "saturday" | undefined) => set({ selectedRestDay }),

  queryPersonnel: "",
  setQueryPersonnel: (queryPersonnel) => set({ queryPersonnel }),
}));
