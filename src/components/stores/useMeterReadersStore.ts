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

  queryPersonnel: string;
  setQueryPersonnel: (queryPersonnel: string) => void;
};

export const useMeterReadersStore = create<MeterReadersStore>((set) => ({
  meterReaders: [
    {
      employeeId: "41f660fd-b1c2-11ed-a79b-000c29f95a80",
      companyId: "2018-004",
      name: "Alcarde, Rey M. ",
      positionTitle: "Water Maintenance Man B",
      assignment: "Customer Care and New Service Connection Division",
      mobileNumber: "09478950423",
      photoUrl: "ALCARDE.jpg",
      restDay: "sunday",
      zonebooks: [
        {
          zone: "01",
          book: "1",
          zoneBook: "01-1",
          area: "",
        },
        {
          zone: "02",
          book: "1",
          zoneBook: "02-1",
          area: "",
        },
        {
          zone: "03",
          book: "3",
          zoneBook: "03-3",
          area: "",
        },
      ],
    },
    {
      employeeId: "94efc3ee-b1c2-11ed-a79b-000c29f95a80",
      companyId: "2015-006",
      name: "Artajo, Charlesbe D. ",
      positionTitle: "Customer Service Assistant A",
      assignment: "Billing and Accounts Division",
      mobileNumber: "09198477782",
      photoUrl: "ARTAJO.jpg",
      restDay: "saturday",
      zonebooks: [
        {
          zone: "01",
          book: "3",
          zoneBook: "01-3",
          area: "",
        },
        {
          zone: "02",
          book: "3",
          zoneBook: "02-3",
          area: "",
        },
        {
          zone: "03",
          book: "7",
          zoneBook: "03-7",
          area: "",
        },
      ],
    },
    {
      employeeId: "94f42488-b1c2-11ed-a79b-000c29f95a80",
      companyId: "2017-029",
      name: "Aujero, Reque A. ",
      positionTitle: "Water Maintenance Man A",
      assignment: "Customer Care and New Service Connection Division",
      mobileNumber: "09189673206",
      photoUrl: "AUJERO.jpg",
      restDay: "saturday",
      zonebooks: [
        {
          zone: "01",
          book: "5",
          zoneBook: "01-5",
          area: "",
        },
        {
          zone: "02",
          book: "7",
          zoneBook: "02-7",
          area: "",
        },
        {
          zone: "03",
          book: "11",
          zoneBook: "03-11",
          area: "",
        },
      ],
    },
    {
      employeeId: "94f98dc1-b1c2-11ed-a79b-000c29f95a80",
      companyId: "2012-002",
      name: "Bacoy, Jojie L. ",
      positionTitle: "Customer Service Assistant A",
      assignment: "Billing and Accounts Division",
      mobileNumber: "09566505818",
      photoUrl: "BACOY.jpg",
      restDay: "saturday",
      zonebooks: [
        {
          zone: "01",
          book: "9",
          zoneBook: "01-9",
          area: "",
        },
        {
          zone: "02",
          book: "11",
          zoneBook: "02-11",
          area: "",
        },
        {
          zone: "03",
          book: "15",
          zoneBook: "03-15",
          area: "",
        },
      ],
    },
  ],
  setMeterReaders: (meterReaders) => set({ meterReaders }),

  selectedMeterReader: undefined,
  setSelectedMeterReader: (selectedMeterReader) => set({ selectedMeterReader }),

  employees: [],
  setEmployees: (employees) => set({ employees }),

  selectedEmployee: undefined,
  setSelectedEmployee: (selectedEmployee) => set({ selectedEmployee }),

  selectedRestDay: undefined,
  setSelectedRestDay: (selectedRestDay: "sunday" | "saturday" | undefined) => set({ selectedRestDay }),

  queryPersonnel: "",
  setQueryPersonnel: (queryPersonnel) => set({ queryPersonnel }),
}));
