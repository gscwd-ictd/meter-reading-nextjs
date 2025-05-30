import { Consumer } from "../types/consumer";

export const SampleConsumerData: Consumer[] = [
  {
    consumerId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    accountNo: "010000",
    concessionaireName: "John Doe",
    primaryContactNumber: "09978129757",
    secondaryContactNumber: "",
    currentBill: 1337.73,
    dueDate: new Date().toISOString(),
    disconnectionDate: new Date().toISOString(),
  },
  {
    consumerId: "1a2b3c4d-5e6f-4a3b-9c8d-7e6f5a4b3c2d",
    accountNo: "010001",
    concessionaireName: "John Smith",
    primaryContactNumber: "09277683029",
    secondaryContactNumber: "",
    currentBill: 513.0,
    dueDate: new Date().toISOString(),
    disconnectionDate: new Date().toISOString(),
  },
  {
    consumerId: "9f1d8a3e-7c6b-4d5e-a1f2-b3c4d5e6f7a8",
    accountNo: "010002",
    concessionaireName: "John Travolta",
    primaryContactNumber: "09978129757",
    secondaryContactNumber: "",
    currentBill: 123456.78,
    dueDate: new Date().toISOString(),
    disconnectionDate: new Date().toISOString(),
  },
  {
    consumerId: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
    accountNo: "010003",
    concessionaireName: "John Deez",
    primaryContactNumber: "09277683029",
    secondaryContactNumber: "",
    currentBill: 1234.56,
    dueDate: new Date().toISOString(),
    disconnectionDate: new Date().toISOString(),
  },
];
