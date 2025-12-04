"use client";
import { useState } from "react";
import { Button } from "@mr/components/ui/Button";
import { DateRange } from "react-day-picker";
import { CalendarDateRangePicker } from "../../../calendar/CalendarDateRangePicker";
import { ZonebookProgressTable } from "./ZonebookProgressTable";
import { format } from "date-fns";

// Import ShadCN UI Dialog components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@mr/components/ui/Dialog";
import { Badge } from "@mr/components/ui/Badge";

type MeterReaderWithZonebooksReports = {
  meterReader: string;
  zoneBook: string;
  accountsRead: number;
  totalAccounts: number;
  status: string;
  readingDate: string;
  isCommitted: boolean;
};

type AccountDetails = {
  id: number;
  accountNumber: string;
  accountName: string;
  address: string;
  previousReading: number;
  currentReading: number | null;
  consumption: number;
  status: "read" | "pending" | "unbilled";
  meterReader: string;
  readingDate: string;
};

// Sample data for accounts in each zonebook
const zonebookAccounts: Record<string, AccountDetails[]> = {
  "Zone 1 / Book 1": [
    {
      id: 1,
      accountNumber: "ACC-001",
      accountName: "John Doe",
      address: "123 Main St, Zone 1",
      previousReading: 1000,
      currentReading: 1050,
      consumption: 50,
      status: "read",
      meterReader: "Artajo, Charlesbe D.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 2,
      accountNumber: "ACC-002",
      accountName: "Jane Smith",
      address: "456 Oak St, Zone 1",
      previousReading: 1500,
      currentReading: 1550,
      consumption: 50,
      status: "read",
      meterReader: "Artajo, Charlesbe D.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 3,
      accountNumber: "ACC-003",
      accountName: "Bob Johnson",
      address: "789 Pine St, Zone 1",
      previousReading: 2000,
      currentReading: null as any,
      consumption: 0,
      status: "pending",
      meterReader: "Artajo, Charlesbe D.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 4,
      accountNumber: "ACC-004",
      accountName: "Alice Brown",
      address: "321 Elm St, Zone 1",
      previousReading: 1200,
      currentReading: 1250,
      consumption: 50,
      status: "read",
      meterReader: "Artajo, Charlesbe D.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 5,
      accountNumber: "ACC-005",
      accountName: "Charlie Wilson",
      address: "654 Maple St, Zone 1",
      previousReading: 1800,
      currentReading: 1850,
      consumption: 50,
      status: "read",
      meterReader: "Artajo, Charlesbe D.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 6,
      accountNumber: "ACC-006",
      accountName: "David Lee",
      address: "987 Cedar St, Zone 1",
      previousReading: 900,
      currentReading: 950,
      consumption: 50,
      status: "read",
      meterReader: "Artajo, Charlesbe D.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 7,
      accountNumber: "ACC-007",
      accountName: "Eva Martinez",
      address: "147 Birch St, Zone 1",
      previousReading: 1100,
      currentReading: null as any,
      consumption: 0,
      status: "unbilled",
      meterReader: "Artajo, Charlesbe D.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 8,
      accountNumber: "ACC-008",
      accountName: "Frank Wilson",
      address: "258 Oak St, Zone 1",
      previousReading: 1300,
      currentReading: 1350,
      consumption: 50,
      status: "read",
      meterReader: "Artajo, Charlesbe D.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 9,
      accountNumber: "ACC-009",
      accountName: "Grace Taylor",
      address: "369 Pine St, Zone 1",
      previousReading: 1400,
      currentReading: 1450,
      consumption: 50,
      status: "read",
      meterReader: "Artajo, Charlesbe D.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 10,
      accountNumber: "ACC-010",
      accountName: "Henry Clark",
      address: "741 Maple St, Zone 1",
      previousReading: 1600,
      currentReading: null as any,
      consumption: 0,
      status: "pending",
      meterReader: "Artajo, Charlesbe D.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
  ],
  "Zone 2 / Book 1": [
    {
      id: 11,
      accountNumber: "ACC-101",
      accountName: "Alice Brown",
      address: "321 Elm St, Zone 2",
      previousReading: 1200,
      currentReading: 1250,
      consumption: 50,
      status: "read",
      meterReader: "Hingco, Ralph Angelo E.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 12,
      accountNumber: "ACC-102",
      accountName: "Charlie Wilson",
      address: "654 Maple St, Zone 2",
      previousReading: 1800,
      currentReading: 1850,
      consumption: 50,
      status: "read",
      meterReader: "Hingco, Ralph Angelo E.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 13,
      accountNumber: "ACC-103",
      accountName: "David Johnson",
      address: "987 Cedar St, Zone 2",
      previousReading: 900,
      currentReading: 950,
      consumption: 50,
      status: "read",
      meterReader: "Hingco, Ralph Angelo E.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 14,
      accountNumber: "ACC-104",
      accountName: "Emma Davis",
      address: "147 Birch St, Zone 2",
      previousReading: 1100,
      currentReading: 1150,
      consumption: 50,
      status: "read",
      meterReader: "Hingco, Ralph Angelo E.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
  ],
  "Zone 2 / Book 2": [
    {
      id: 15,
      accountNumber: "ACC-201",
      accountName: "David Lee",
      address: "987 Cedar St, Zone 2",
      previousReading: 900,
      currentReading: 950,
      consumption: 50,
      status: "read",
      meterReader: "Oliva, Jeramel R.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 16,
      accountNumber: "ACC-202",
      accountName: "Eva Martinez",
      address: "147 Birch St, Zone 2",
      previousReading: 1100,
      currentReading: null as any,
      consumption: 0,
      status: "unbilled",
      meterReader: "Oliva, Jeramel R.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 17,
      accountNumber: "ACC-203",
      accountName: "George Miller",
      address: "258 Oak St, Zone 2",
      previousReading: 1300,
      currentReading: 1350,
      consumption: 50,
      status: "read",
      meterReader: "Oliva, Jeramel R.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 18,
      accountNumber: "ACC-204",
      accountName: "Helen Wilson",
      address: "369 Pine St, Zone 2",
      previousReading: 1400,
      currentReading: 1450,
      consumption: 50,
      status: "read",
      meterReader: "Oliva, Jeramel R.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
  ],
  "Zone 3 / Book 1": [
    {
      id: 19,
      accountNumber: "ACC-301",
      accountName: "Ian Thompson",
      address: "123 Central St, Zone 3",
      previousReading: 1000,
      currentReading: 1050,
      consumption: 50,
      status: "read",
      meterReader: "Smith, John A.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 20,
      accountNumber: "ACC-302",
      accountName: "Julia Roberts",
      address: "456 North St, Zone 3",
      previousReading: 1500,
      currentReading: 1550,
      consumption: 50,
      status: "read",
      meterReader: "Smith, John A.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
  ],
  "Zone 3 / Book 2": [
    {
      id: 21,
      accountNumber: "ACC-303",
      accountName: "Kevin Adams",
      address: "789 South St, Zone 3",
      previousReading: 2000,
      currentReading: null as any,
      consumption: 0,
      status: "pending",
      meterReader: "Davis, Sarah M.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 22,
      accountNumber: "ACC-304",
      accountName: "Laura White",
      address: "321 East St, Zone 3",
      previousReading: 1200,
      currentReading: 1250,
      consumption: 50,
      status: "read",
      meterReader: "Davis, Sarah M.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
  ],
  "Zone 4 / Book 1": [
    {
      id: 23,
      accountNumber: "ACC-401",
      accountName: "Michael Brown",
      address: "654 West St, Zone 4",
      previousReading: 1800,
      currentReading: 1850,
      consumption: 50,
      status: "read",
      meterReader: "Wilson, Robert T.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 24,
      accountNumber: "ACC-402",
      accountName: "Nancy Green",
      address: "987 Hill St, Zone 4",
      previousReading: 900,
      currentReading: 950,
      consumption: 50,
      status: "read",
      meterReader: "Wilson, Robert T.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 25,
      accountNumber: "ACC-403",
      accountName: "Oliver Queen",
      address: "147 Valley St, Zone 4",
      previousReading: 1100,
      currentReading: null as any,
      consumption: 0,
      status: "unbilled",
      meterReader: "Wilson, Robert T.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
  ],
  "Zone 4 / Book 2": [
    {
      id: 26,
      accountNumber: "ACC-401",
      accountName: "Michael Brown",
      address: "654 West St, Zone 4",
      previousReading: 1800,
      currentReading: null,
      consumption: 0,
      status: "unbilled",
      meterReader: "Wilson, Robert T.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 27,
      accountNumber: "ACC-402",
      accountName: "Nancy Green",
      address: "987 Hill St, Zone 4",
      previousReading: 900,
      currentReading: null,
      consumption: 0,
      status: "unbilled",
      meterReader: "Wilson, Robert T.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 28,
      accountNumber: "ACC-403",
      accountName: "Oliver Queen",
      address: "147 Valley St, Zone 4",
      previousReading: 1100,
      currentReading: null as any,
      consumption: 0,
      status: "unbilled",
      meterReader: "Wilson, Robert T.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 29,
      accountNumber: "ACC-403",
      accountName: "Oliver Queen",
      address: "147 Valley St, Zone 4",
      previousReading: 1100,
      currentReading: null as any,
      consumption: 0,
      status: "unbilled",
      meterReader: "Wilson, Robert T.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 30,
      accountNumber: "ACC-403",
      accountName: "Oliver Queen",
      address: "147 Valley St, Zone 4",
      previousReading: 1100,
      currentReading: null as any,
      consumption: 0,
      status: "unbilled",
      meterReader: "Wilson, Robert T.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
  ],
  "Zone 5 / Book 1": [
    {
      id: 31,
      accountNumber: "ACC-501",
      accountName: "Elisse Fur",
      address: "654 East St, Zone 1",
      previousReading: 1800,
      currentReading: 1850,
      consumption: 50,
      status: "read",
      meterReader: "Wilson, Robert T.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 32,
      accountNumber: "ACC-502",
      accountName: "Nancy White",
      address: "987 Hill St, Zone 2",
      previousReading: 900,
      currentReading: 950,
      consumption: 50,
      status: "read",
      meterReader: "Wilson, Robert T.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
    {
      id: 33,
      accountNumber: "ACC-503",
      accountName: "Oliver Kings",
      address: "147 Valley St, Zone 4",
      previousReading: 1100,
      currentReading: null as any,
      consumption: 0,
      status: "unbilled",
      meterReader: "Wilson, Robert T.",
      readingDate: format(new Date(), "MMM dd, yyyy"),
    },
  ],
};

const sampleData: MeterReaderWithZonebooksReports[] = [
  {
    meterReader: "Artajo, Charlesbe D.",
    zoneBook: "Zone 1 / Book 1",
    accountsRead: 7,
    totalAccounts: 10,
    status: "in progress",
    readingDate: format(new Date(), "MMM dd, yyyy"),
    isCommitted: false,
  },
  {
    meterReader: "Hingco, Ralph Angelo E.",
    zoneBook: "Zone 2 / Book 1",
    accountsRead: 4,
    totalAccounts: 4,
    status: "completed",
    readingDate: format(new Date(), "MMM dd, yyyy"),
    isCommitted: true,
  },
  {
    meterReader: "Oliva, Jeramel R.",
    zoneBook: "Zone 2 / Book 2",
    accountsRead: 3,
    totalAccounts: 4,
    status: "in progress",
    readingDate: format(new Date(), "MMM dd, yyyy"),
    isCommitted: false,
  },
  {
    meterReader: "Smith, John A.",
    zoneBook: "Zone 3 / Book 1",
    accountsRead: 2,
    totalAccounts: 2,
    status: "completed",
    readingDate: format(new Date(), "MMM dd, yyyy"),
    isCommitted: true,
  },
  {
    meterReader: "Davis, Sarah M.",
    zoneBook: "Zone 3 / Book 2",
    accountsRead: 1,
    totalAccounts: 2,
    status: "in progress",
    readingDate: format(new Date(), "MMM dd, yyyy"),
    isCommitted: false,
  },
  {
    meterReader: "Wilson, Robert T.",
    zoneBook: "Zone 4 / Book 1",
    accountsRead: 2,
    totalAccounts: 3,
    status: "in progress",
    readingDate: format(new Date(), "MMM dd, yyyy"),
    isCommitted: false,
  },
  {
    meterReader: "Taylor, Jennifer L.",
    zoneBook: "Zone 4 / Book 2",
    accountsRead: 0,
    totalAccounts: 5,
    status: "not started",
    readingDate: format(new Date(), "MMM dd, yyyy"),
    isCommitted: false,
  },
  {
    meterReader: "Moore, David K.",
    zoneBook: "Zone 5 / Book 1",
    accountsRead: 8,
    totalAccounts: 8,
    status: "completed",
    readingDate: format(new Date(), "MMM dd, yyyy"),
    isCommitted: true,
  },
];

export const ZonebookDailyProgressComponent = () => {
  const [dateRange, setDateRange] = useState<DateRange>();
  const [submittedRange, setSubmittedRange] = useState<DateRange | null>(null);
  const [selectedZonebook, setSelectedZonebook] = useState<string | null>(null);
  const [selectedRowData, setSelectedRowData] = useState<MeterReaderWithZonebooksReports | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = () => {
    if (!dateRange?.from) {
      alert("Please select a date range first");
      return;
    }
    setSubmittedRange(dateRange);
  };

  const handleRowClick = (zoneBook: string, rowData: MeterReaderWithZonebooksReports) => {
    setSelectedZonebook(zoneBook);
    setSelectedRowData(rowData);
    setIsDialogOpen(true);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "read":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "unbilled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const accounts = selectedZonebook ? zonebookAccounts[selectedZonebook] || [] : [];

  return (
    <div className="space-y-4 pt-4 lg:p-4">
      <div className="flex justify-center gap-2 px-4 sm:justify-center md:justify-center lg:justify-end">
        <CalendarDateRangePicker onDateChange={setDateRange} initialDate={{ from: new Date() }} />

        <Button onClick={handleSubmit} disabled={!dateRange?.from} className="dark:text-white">
          Submit
        </Button>
      </div>

      {submittedRange && (
        <div className="bg-muted/50 mt-4 rounded-lg border p-4">
          <h3 className="font-medium">Submitted Range:</h3>
          <div>From: {submittedRange.from?.toLocaleDateString()}</div>
          <div>To: {submittedRange.to?.toLocaleDateString()}</div>
        </div>
      )}

      <ZonebookProgressTable data={sampleData} onRowClick={handleRowClick} />

      {/* Dialog for showing accounts */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[100vh] overflow-y-auto sm:max-w-6xl lg:max-h-[80vh] lg:max-w-7xl dark:bg-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-xl">Accounts for {selectedZonebook}</DialogTitle>
            <DialogDescription>
              {selectedRowData && (
                <span className="mt-2 space-y-1">
                  <span>Meter Reader: {selectedRowData.meterReader}, </span>
                  <span>Reading Date: {selectedRowData.readingDate}</span>
                  <span className="mt-2 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`capitalize ${
                        selectedRowData.status === "completed"
                          ? "border-green-100 bg-green-50 text-green-700"
                          : "border-yellow-100 bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {selectedRowData.status}
                    </Badge>
                    <span className="text-sm">
                      Progress: {selectedRowData.accountsRead}/{selectedRowData.totalAccounts} accounts (
                      {Math.round((selectedRowData.accountsRead / selectedRowData.totalAccounts) * 100)}%)
                    </span>
                  </span>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {accounts.length > 0 ? (
            <div className="mt-4">
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 text-left font-medium">Account #</th>
                      <th className="p-3 text-left font-medium">Account Name</th>
                      <th className="p-3 text-left font-medium">Address</th>
                      <th className="p-3 text-left font-medium">Previous</th>
                      <th className="p-3 text-left font-medium">Current</th>
                      <th className="p-3 text-left font-medium">Consumption</th>
                      <th className="p-3 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((account) => (
                      <tr key={account.id} className="hover:bg-muted/30 border-t">
                        <td className="p-3">{account.accountNumber}</td>
                        <td className="p-3">{account.accountName}</td>
                        <td className="p-3">{account.address}</td>
                        <td className="p-3">{account.previousReading.toLocaleString()}</td>
                        <td className="p-3">
                          {account.currentReading ? account.currentReading.toLocaleString() : "—"}
                        </td>
                        <td className="p-3">{account.consumption.toLocaleString()}</td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(account.status)}`}
                          >
                            {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* SUMMARY */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium">Summary</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span>Total Accounts:</span>
                      <span className="font-medium">{accounts.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Successfully Read:</span>
                      <span className="font-medium text-green-600">
                        {accounts.filter((a) => a.status === "read").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending:</span>
                      <span className="font-medium text-yellow-600">
                        {accounts.filter((a) => a.status === "pending").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Problems:</span>
                      <span className="font-medium text-red-600">
                        {accounts.filter((a) => a.status === "unbilled").length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-medium">Total Consumption</h4>
                  <p className="mt-2 text-2xl font-bold">
                    {accounts.reduce((sum, acc) => sum + acc.consumption, 0).toLocaleString()}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">Cubic Meters</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No accounts found for this zonebook.</p>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
