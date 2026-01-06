"use client";
import { useEffect, useState } from "react";
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
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@mr/components/ui/AlertDialog";
import { AccountDetails } from "@mr/lib/types/accounts";
import { AccountsDataTable } from "@mr/components/features/data-tables/accounts/AccountsDataTable";
import { useRouter, useSearchParams } from "next/navigation";

export const ZonebookDailyProgressComponent = () => {
  const searchParams = useSearchParams();

  const [completeDialogIsOpen, setCompleteDialogIsOpen] = useState<boolean>(false);
  const zonebookProgressEntryDialogIsOpen = useZonebookProgressStore(
    (state) => state.zonebookProgressEntryDialogIsOpen,
  );
  const setZonebookProgressEntryDialogIsOpen = useZonebookProgressStore(
    (state) => state.setZonebookProgressEntryDialogIsOpen,
  );

  const setMonthYear = useZonebookProgressStore((state) => state.setMonthYear);
  const generatedMonthYear = useZonebookProgressStore((state) => state.monthYear);

  // Get date from URL or use current date
  const urlMonthYear = searchParams.get("date");

  // Initialize currentMonthYear with URL parameter or store value
  const [currentMonthYear, setCurrentMonthYear] = useState<string>(
    urlMonthYear || generatedMonthYear || format(new Date(), "yyyy-MM"),
  );

  const selectedZonebookEntry = useZonebookProgressStore((state) => state.selectedZonebookEntry);
  const router = useRouter();

  // Initialize store from URL on first mount
  useEffect(() => {
    if (urlMonthYear && urlMonthYear !== generatedMonthYear) {
      setMonthYear(urlMonthYear);
    }
  }, []); // Empty dependency array - runs only on mount

  // Handle month year submission
  const handleMonthYearSubmit = () => {
    if (currentMonthYear !== generatedMonthYear) {
      setMonthYear(currentMonthYear);
      // Update URL immediately
      router.replace(`/progress/zonebooks?date=${currentMonthYear}`);
    }
  };

  // Sync URL when generatedMonthYear changes (except on user submit)
  useEffect(() => {
    // Don't do anything on initial mount
    if (!urlMonthYear && generatedMonthYear) {
      // If no URL param but we have store value, update URL
      router.replace(`/progress/zonebooks?date=${generatedMonthYear}`);
    }
  }, [generatedMonthYear, router, urlMonthYear]);

  const { data: selectedZonebookWithAccounts, isLoading } = useQuery({
    queryKey: [
      "zonebook-data",
      selectedZonebookEntry.meterReader?.id,
      selectedZonebookEntry.zone,
      selectedZonebookEntry.book,
      generatedMonthYear, // Use generatedMonthYear from store
    ],
    enabled: selectedZonebookEntry !== null && zonebookProgressEntryDialogIsOpen && !!generatedMonthYear,
    queryFn: async () => {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_MR_BE}/progress/zonebooks`, {
        meterReaderId: selectedZonebookEntry.meterReader.id,
        zone: selectedZonebookEntry.zone,
        book: selectedZonebookEntry.book,
        readingMonth: generatedMonthYear, // Use generatedMonthYear
      });

      return res.data as AccountDetails[];
    },
    retry: 2,
  });
  return (
    <div className="mt-4 space-y-4">
      <ZonebookProgressDataTable
        actionBtn={
          <YearMonthPickerWithSubmit
            value={currentMonthYear}
            onChange={setCurrentMonthYear}
            onSubmit={handleMonthYearSubmit}
          />
        }
      />
      {/* Dialog for showing accounts */}
      <Dialog open={zonebookProgressEntryDialogIsOpen} onOpenChange={setZonebookProgressEntryDialogIsOpen}>
        <DialogContent className="max-h-[100vh] overflow-y-auto sm:max-w-6xl lg:h-[90vh] lg:max-w-7xl dark:bg-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Zone {selectedZonebookEntry.zone} / Book {selectedZonebookEntry.book}{" "}
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
                  <span>Assigned Meter Reader: {selectedZonebookEntry.meterReader?.name} </span>

                  {/* <span className="mt-2 flex items-center gap-2">
                    <span className="text-sm">
                      Progress: {selectedZonebookEntry.totalRead}/{selectedZonebookEntry.totalAccounts}{" "}
                      accounts (
                      {Math.round(
                        (selectedZonebookEntry.totalRead / selectedZonebookEntry.totalAccounts) * 100,
                      )}
                      %)
                    </span>
                  </span> */}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex h-full w-full justify-center">
              <LoadingSpinner size={64} className="text-primary" />
            </div>
          ) : !isLoading && selectedZonebookWithAccounts && selectedZonebookWithAccounts.length > 0 ? (
            <>
              <div className="mt-0 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border px-4 py-2 text-sm">
                  <h4 className="font-bold">Summary</h4>
                  <div className="mt-1 space-y-1">
                    <div className="flex justify-between">
                      <span>Billed</span>
                      <span className="font-medium text-green-600">
                        {selectedZonebookWithAccounts &&
                          selectedZonebookWithAccounts.filter((a) => a.isRead).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unbilled</span>
                      <span className="font-medium text-yellow-600">
                        {selectedZonebookWithAccounts &&
                          selectedZonebookWithAccounts.filter((a) => !a.isRead).length}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Total Service Connections</span>
                      <span className="font-medium">
                        {selectedZonebookWithAccounts && selectedZonebookWithAccounts.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border px-4 py-2">
                  <h4 className="font-medium">Total Consumption</h4>
                  <p className="mt-2 text-2xl font-bold">
                    {selectedZonebookWithAccounts &&
                      selectedZonebookWithAccounts
                        // .reduce((sum, acc) => sum + acc.previousReading, 0)
                        .reduce(
                          (sum, acc) =>
                            sum + (acc.currentReading !== 0 ? acc.currentReading! - acc.previousReading : 0),
                          0,
                        )
                        .toLocaleString()}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">Cubic Meters</p>
                </div>
              </div>
              <AccountsDataTable />
            </>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No accounts found for this zonebook.</p>
            </div>
          )}
          {/* Commit button */}
          {selectedZonebookWithAccounts && selectedZonebookWithAccounts.length > 0 && (
            <div className="mt-6 flex justify-end">
              {/* {selectedZonebookEntry.statusProgress === 'in progress' ? } */}
              {selectedZonebookEntry.statusProgress !== "in progress" &&
                !selectedZonebookEntry?.isCommitted && (
                  <Button
                    onClick={() => setZonebookProgressEntryDialogIsOpen(false)}
                    className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 active:ring-2 active:ring-green-400"
                  >
                    Commit
                  </Button>
                )}
              {selectedZonebookEntry?.isCommitted && (
                <Button
                  onClick={() => setCompleteDialogIsOpen(true)}
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

      <AlertDialog open={completeDialogIsOpen} onOpenChange={setCompleteDialogIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data
              from our servers.
              <span>ID: {selectedZonebookEntry.meterReader?.id}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
