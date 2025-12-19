"use client";
import { useState } from "react";
import { Button } from "@mr/components/ui/Button";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@mr/components/ui/Dialog";
import { Badge } from "@mr/components/ui/Badge";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { YearMonthPickerWithSubmit } from "@mr/components/features/calendar/YearMonthPickerWithSubmit";
import { ZonebookProgressDataTable } from "./ZonebookProgressDataTable";
import { useZonebookProgressStore } from "@mr/components/stores/useZonebookProgressStore";
import { ZonebookProgressWithAccounts } from "@mr/lib/types/zonebook";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";

export const ZonebookDailyProgressComponent = () => {
  const [currentMonthYear, setCurrentMonthYear] = useState<string>(format(new Date(), "yyyy-MM"));
  const zonebookProgressEntryDialogIsOpen = useZonebookProgressStore(
    (state) => state.zonebookProgressEntryDialogIsOpen,
  );
  const setZonebookProgressEntryDialogIsOpen = useZonebookProgressStore(
    (state) => state.setZonebookProgressEntryDialogIsOpen,
  );

  const setMonthYear = useZonebookProgressStore((state) => state.setMonthYear);
  const monthYear = useZonebookProgressStore((state) => state.monthYear);
  const selectedZonebookEntry = useZonebookProgressStore((state) => state.selectedZonebookEntry);

  const { data: selectedZonebookWithAccounts, isLoading } = useQuery({
    queryKey: ["zonebook-data"],
    enabled: selectedZonebookEntry !== null && zonebookProgressEntryDialogIsOpen && !!monthYear,
    queryFn: async () => {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_MR_BE}/progress/zonebooks`, {
        meterReaderId: selectedZonebookEntry.meterReader.id,
        zone: selectedZonebookEntry.zone,
        book: selectedZonebookEntry.book,
        readingMonth: monthYear,
      });

      console.log(res.data);
      return res.data as ZonebookProgressWithAccounts;
    },
    retry: 2,
  });

  const getstatusProgressBadgeClass = (statusProgress: string) => {
    switch (statusProgress) {
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

  return (
    <div className="mt-4 space-y-4">
      <ZonebookProgressDataTable
        actionBtn={
          <YearMonthPickerWithSubmit
            value={currentMonthYear}
            onChange={setCurrentMonthYear}
            onSubmit={() => setMonthYear(currentMonthYear)}
          />
        }
      />
      {/* Dialog for showing accounts */}
      <Dialog open={zonebookProgressEntryDialogIsOpen} onOpenChange={setZonebookProgressEntryDialogIsOpen}>
        <DialogContent className="max-h-[100vh] overflow-y-auto sm:max-w-6xl lg:max-h-[80vh] lg:max-w-7xl dark:bg-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Accounts for Zone {selectedZonebookEntry.zone} / Book {selectedZonebookEntry.book}{" "}
              <Badge
                variant="outline"
                className={`capitalize ${
                  selectedZonebookEntry && selectedZonebookEntry.statusProgress === "completed"
                    ? "border-green-100 bg-green-50 text-green-700"
                    : "border-yellow-100 bg-yellow-50 text-yellow-700"
                }`}
              >
                {selectedZonebookEntry && selectedZonebookEntry.statusProgress}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              {selectedZonebookEntry && (
                <span className="mt-2 space-y-1">
                  <span>Meter Reader: {selectedZonebookEntry.meterReader?.name} </span>

                  <span className="mt-2 flex items-center gap-2">
                    <span className="text-sm">
                      Progress: {selectedZonebookEntry.totalRead}/{selectedZonebookEntry.totalAccounts}{" "}
                      accounts (
                      {Math.round(
                        (selectedZonebookEntry.totalRead / selectedZonebookEntry.totalAccounts) * 100,
                      )}
                      %)
                    </span>
                  </span>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex h-full w-full justify-center">
              <LoadingSpinner size={64} className="text-primary" />
            </div>
          ) : selectedZonebookWithAccounts &&
            selectedZonebookWithAccounts.accounts &&
            selectedZonebookWithAccounts?.accounts.length > 0 ? (
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
                      <th className="p-3 text-left font-medium">statusProgress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedZonebookWithAccounts.accounts.map((account) => (
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
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getstatusProgressBadgeClass(account.statusProgress)}`}
                          >
                            {account.statusProgress.charAt(0).toUpperCase() + account.statusProgress.slice(1)}
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
                      <span className="font-medium">{selectedZonebookWithAccounts.accounts.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Successfully Read:</span>
                      <span className="font-medium text-green-600">
                        {
                          selectedZonebookWithAccounts.accounts.filter((a) => a.statusProgress === "read")
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending:</span>
                      <span className="font-medium text-yellow-600">
                        {
                          selectedZonebookWithAccounts.accounts.filter((a) => a.statusProgress === "pending")
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Problems:</span>
                      <span className="font-medium text-red-600">
                        {
                          selectedZonebookWithAccounts.accounts.filter((a) => a.statusProgress === "unbilled")
                            .length
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-medium">Total Consumption</h4>
                  <p className="mt-2 text-2xl font-bold">
                    {selectedZonebookWithAccounts.accounts
                      .reduce((sum, acc) => sum + acc.consumption, 0)
                      .toLocaleString()}
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

          {/* Commit button */}
          {selectedZonebookWithAccounts &&
            selectedZonebookWithAccounts.accounts &&
            selectedZonebookWithAccounts.accounts.length > 0 && (
              <div className="mt-6 flex justify-end">
                {!selectedZonebookEntry?.isCommitted && (
                  <Button
                    onClick={() => setZonebookProgressEntryDialogIsOpen(false)}
                    className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 active:ring-2 active:ring-green-400"
                  >
                    Commit
                  </Button>
                )}
                {selectedZonebookEntry?.isCommitted && (
                  <Button
                    onClick={() => setZonebookProgressEntryDialogIsOpen(false)}
                    className="w-full"
                    variant="secondary"
                    disabled
                  >
                    Already committed
                  </Button>
                )}
              </div>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
