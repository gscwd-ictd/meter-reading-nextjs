"use client";
import { FunctionComponent, useEffect, useState } from "react";
import { Button } from "@mr/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@mr/components/ui/Dialog";
import { Badge } from "@mr/components/ui/Badge";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ZonebookProgressDataTable } from "./ZonebookProgressDataTable";
import { useZonebookProgressStore } from "@mr/components/stores/useZonebookProgressStore";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { AccountDetails, MeterReadingReportParams } from "@mr/lib/types/accounts";
import { AccountsDataTable } from "@mr/components/features/data-tables/accounts/AccountsDataTable";
import { useRouter, useSearchParams } from "next/navigation";
import { formatYearMonthToReadableDate } from "@mr/lib/functions/formatDate";
import {
  CheckCircle,
  CheckCircle2Icon,
  FileText,
  Lock,
  MessageSquareTextIcon,
  Signal,
  UserIcon,
} from "lucide-react";
import { YearMonthPicker } from "@mr/components/features/calendar/YearMonthPicker";
import { useAccountsStore } from "@mr/components/stores/useAccountsStore";
import { meterReadingReportMutation } from "@mr/lib/functions/meterReadingReportMutation";
import { toast } from "sonner";

export const ZonebookDailyProgressComponent: FunctionComponent = () => {
  const searchParams = useSearchParams();

  const [completeDialogIsOpen, setCompleteDialogIsOpen] = useState<boolean>(false);

  const zonebookProgressEntryDialogIsOpen = useZonebookProgressStore(
    (state) => state.zonebookProgressEntryDialogIsOpen,
  );
  const setZonebookProgressEntryDialogIsOpen = useZonebookProgressStore(
    (state) => state.setZonebookProgressEntryDialogIsOpen,
  );

  const accountDetailsDialogIsOpen = useZonebookProgressStore((state) => state.accountDetailsDialogIsOpen);
  const setAccountDetailsDialogIsOpen = useZonebookProgressStore(
    (state) => state.setAccountDetailsDialogIsOpen,
  );

  const selectedAccount = useAccountsStore((state) => state.selectedAccount);

  const setMonthYear = useZonebookProgressStore((state) => state.setMonthYear);
  const monthYear = useZonebookProgressStore((state) => state.monthYear);
  const refetch = useZonebookProgressStore((state) => state.refetch);

  // Get date from URL or use current date
  const urlMonthYear = searchParams.get("date");

  const selectedZonebookEntry = useZonebookProgressStore((state) => state.selectedZonebookEntry);
  const router = useRouter();

  // form the params object
  const params: MeterReadingReportParams = {
    monthYear: monthYear,
    zone: selectedZonebookEntry?.zone ? selectedZonebookEntry.zone : "",
    book: selectedZonebookEntry?.book ? selectedZonebookEntry.book : "",
    meterReaderId:
      selectedZonebookEntry.meterReader && selectedZonebookEntry.meterReader.id
        ? selectedZonebookEntry.meterReader.id
        : "",
  };

  // mutate function to commit zonebook
  const mutateCommit = useMutation({
    mutationKey: [
      "commit-meter-reading-progress",
      monthYear,
      selectedZonebookEntry?.meterReader?.id,
      selectedZonebookEntry?.zone,
      selectedZonebookEntry?.book,
    ],
    mutationFn: async (meterReadingReportParams: MeterReadingReportParams) =>
      meterReadingReportMutation(meterReadingReportParams),
    onError: (error) => {
      toast.error("Error", { description: error ? error.message : "", position: "top-right" });
    },
    onSuccess: () => {
      setCompleteDialogIsOpen(false);
      setZonebookProgressEntryDialogIsOpen(false);
      refetch?.();
      toast.success("Success", {
        description: `You have successfully committed for ${monthYear ? formatYearMonthToReadableDate(monthYear) : ""}`,
        position: "top-right",
      });
    },
  });

  // alert confirmation action
  const handleComplete = () => mutateCommit.mutateAsync(params);

  // Initialize store from URL on first mount
  useEffect(() => {
    if (urlMonthYear && urlMonthYear !== monthYear) {
      setMonthYear(urlMonthYear);
    }
  }, []); // Empty dependency array - runs only on mount

  // Sync URL when generatedMonthYear changes (except on user submit)
  useEffect(() => {
    // Don't do anything on initial mount
    if (monthYear) {
      // If no URL param but we have store value, update URL
      router.replace(`/progress/zonebooks?date=${monthYear}`);
    }
  }, [monthYear, router]);

  // Load the accounts for the selected zone book and selected year month
  const { data: selectedZonebookWithAccounts, isLoading } = useQuery({
    queryKey: [
      "zonebook-data",
      selectedZonebookEntry.meterReader?.id,
      selectedZonebookEntry.zone,
      selectedZonebookEntry.book,
      monthYear, // Use monthYear from store
    ],
    enabled: selectedZonebookEntry !== null && zonebookProgressEntryDialogIsOpen && !!monthYear,
    queryFn: async () => {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_MR_BE}/progress/zonebooks`, {
        meterReaderId: selectedZonebookEntry.meterReader.id,
        zone: selectedZonebookEntry.zone,
        book: selectedZonebookEntry.book,
        readingMonth: monthYear, // Use monthYear
      });

      return res.data as AccountDetails[];
    },
    retry: 2,
  });

  return (
    <>
      <div className="mt-4 space-y-4">
        <ZonebookProgressDataTable
          actionBtn={<YearMonthPicker value={monthYear} onChange={setMonthYear} />}
        />
      </div>

      {/* Dialog for showing accounts */}
      <Dialog open={zonebookProgressEntryDialogIsOpen} onOpenChange={setZonebookProgressEntryDialogIsOpen}>
        <DialogContent className="flex max-h-[95%] flex-col overflow-y-auto sm:max-w-6xl lg:max-w-[90%] dark:bg-gray-900 dark:text-gray-100">
          {/* Header Section */}
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold">
                  Zone {selectedZonebookEntry.zone} / Book {selectedZonebookEntry.book}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  {selectedZonebookEntry && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Assigned Meter Reader: {selectedZonebookEntry.meterReader?.name}
                    </span>
                  )}
                </DialogDescription>
              </div>

              <Badge
                variant="outline"
                className={`px-3 py-1 text-sm font-medium capitalize ${
                  selectedZonebookEntry?.statusProgress === "completed"
                    ? "border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                }`}
              >
                {selectedZonebookEntry?.statusProgress}
              </Badge>
            </div>
          </DialogHeader>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <LoadingSpinner size={64} className="text-primary" />
            </div>
          ) : (
            <>
              {/* Cards Section */}
              {!isLoading && selectedZonebookWithAccounts && selectedZonebookWithAccounts.length > 0 ? (
                <>
                  <div className="mt-0 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Summary Card */}
                    <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300">Summary</h3>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {urlMonthYear ? formatYearMonthToReadableDate(urlMonthYear) : ""}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-sm">Billed</span>
                          </div>
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {selectedZonebookWithAccounts.filter((a) => a.isRead).length}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                            <span className="text-sm">Unbilled</span>
                          </div>
                          <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                            {selectedZonebookWithAccounts.filter((a) => !a.isRead).length}
                          </span>
                        </div>

                        <div className="flex items-center justify-between border-t pt-2 dark:border-gray-700">
                          <span className="text-sm font-medium">Total Service Connections</span>
                          <span className="font-bold text-gray-800 dark:text-gray-200">
                            {selectedZonebookWithAccounts.length}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Consumption Card */}
                    <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <h3 className="mb-4 font-semibold text-gray-700 dark:text-gray-300">
                        Total Consumption
                      </h3>
                      <div className="space-y-2">
                        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                          {selectedZonebookWithAccounts
                            .reduce(
                              (sum, acc) =>
                                sum +
                                (acc.currentReading !== 0 ? acc.currentReading! - acc.previousReading : 0),
                              0,
                            )
                            .toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Cubic Meters</p>
                      </div>
                    </div>

                    {/* Third Card Placeholder - You could add another metric here */}
                    {/* <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800/50">
                      <h3 className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Additional Metrics
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Add more insights or statistics here
                      </p>
                    </div> */}
                  </div>

                  {/* Data Table Section */}
                  <div className="mt-0 flex-1">
                    <div className="rounded-lg border bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800">
                      <AccountsDataTable />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-0">
                    <div className="flex items-center justify-end gap-3">
                      <Button variant="outline" onClick={() => setZonebookProgressEntryDialogIsOpen(false)}>
                        Close
                      </Button>

                      {selectedZonebookWithAccounts && selectedZonebookWithAccounts.length > 0 && (
                        <>
                          {selectedZonebookEntry.statusProgress !== "in progress" &&
                            !selectedZonebookEntry?.isCommitted && (
                              <Button
                                onClick={() => setCompleteDialogIsOpen(true)}
                                className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:text-white dark:hover:bg-green-600"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Commit Zonebook
                              </Button>
                            )}

                          {selectedZonebookEntry?.isCommitted && (
                            <Button
                              onClick={() => setCompleteDialogIsOpen(true)}
                              variant="secondary"
                              disabled
                              className="opacity-70"
                            >
                              <Lock className="mr-2 h-4 w-4" />
                              Already Committed
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                /* Empty State */
                <div className="flex flex-1 flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                    <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
                    No accounts found
                  </p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    No accounts available for this zonebook in the selected period.
                  </p>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Complete Dialog */}
      <Dialog open={completeDialogIsOpen} onOpenChange={setCompleteDialogIsOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="p-0">
            {/* Clean modern header */}
            <div className="mb-8 flex items-start justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  Commit zonebook
                </DialogTitle>
                <p className="mt-1 text-sm text-gray-500">Review before finalizing</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.801 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.801 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>
              </div>
            </div>

            {/* Key information - better aligned */}
            <div className="space-y-6">
              {/* Zonebook info card */}
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-400">
                      Zone {selectedZonebookEntry.zone} • Book {selectedZonebookEntry.book}
                    </div>
                    <div className="text-sm text-gray-500">
                      {urlMonthYear ? formatYearMonthToReadableDate(urlMonthYear!) : ""}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium tracking-wide text-gray-500 uppercase">Accounts</div>
                    <div className="text-xl font-semibold text-gray-900 dark:text-gray-400">
                      {selectedZonebookWithAccounts && selectedZonebookWithAccounts.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status breakdown - properly aligned */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex flex-col items-center rounded-lg border border-gray-200 p-3">
                    <div className="mb-2 flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Billed</span>
                    </div>
                    <div className="text-2xl font-semibold text-gray-900 dark:text-gray-400">
                      {selectedZonebookWithAccounts &&
                        selectedZonebookWithAccounts.filter((a) => a.isRead).length}
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col items-center rounded-lg border border-gray-200 p-3">
                    <div className="mb-2 flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-gray-400"></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Unbilled</span>
                    </div>
                    <div className="text-2xl font-semibold text-gray-900 dark:text-gray-400">
                      {selectedZonebookWithAccounts &&
                        selectedZonebookWithAccounts.filter((a) => !a.isRead).length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning message */}
              <div className="rounded-lg bg-gray-50 px-4 py-3">
                <div className="flex items-start">
                  <svg
                    className="mt-0.5 mr-3 h-4 w-4 flex-shrink-0 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.768 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">This action cannot be undone.</span> All transactions will
                    be permanently committed.
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons - better aligned */}
            <div className="mt-8 flex items-center justify-end gap-3">
              <Button
                className="px-5 py-2 hover:brightness-75 dark:text-white"
                onClick={() => {
                  setCompleteDialogIsOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleComplete}
                className="bg-green-800 px-5 py-2 text-white hover:bg-green-700 active:bg-green-600 dark:text-white"
              >
                <CheckCircle className="h-4 w-4" />
                Commit Zonebook
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for showing each account */}
      <Dialog open={accountDetailsDialogIsOpen} onOpenChange={setAccountDetailsDialogIsOpen}>
        <DialogContent className="flex max-h-[95%] flex-col overflow-y-auto sm:max-w-5xl lg:max-w-[65%] dark:bg-gray-900 dark:text-gray-100">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Account Details
              </DialogTitle>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  #{selectedAccount.accountNumber}-{selectedAccount.checkDigit}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Zone {selectedZonebookEntry.zone} / Book {selectedZonebookEntry.book}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-3">
            {/* Account Header with Stats */}
            <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              {selectedAccount.accountName}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="grid grid-cols-4 gap-2">
                  <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-800">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Current Reading</div>
                      <div className="text-lg font-bold">{selectedAccount.currentReading}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-800">
                    <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Previous</div>
                      <div className="text-lg font-bold text-gray-600 dark:text-gray-300">
                        {selectedAccount.previousReading}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-800">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Consumption</div>
                      <div className="text-lg font-bold">
                        {selectedAccount.currentReading === 0
                          ? "-"
                          : Math.max(0, selectedAccount.currentReading - selectedAccount.previousReading)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-center rounded-lg bg-gradient-to-r from-blue-50 to-white p-4 dark:from-blue-950/20 dark:to-gray-800">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {selectedAccount.amount > 0 &&
                      Math.max(0, selectedAccount.currentReading - selectedAccount.previousReading) > 0 ? (
                        <span>
                          {" "}
                          ₱ {selectedAccount && selectedAccount.amount && selectedAccount.amount.toFixed(2)}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Billed Amount</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reading Details Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Reading Information */}
              <div className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center gap-2">
                  <Signal className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Reading Information</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Reading Date</span>
                    <span
                      className={`font-medium ${selectedAccount.readingDate ? "text-gray-900 dark:text-white" : "text-gray-400"}`}
                    >
                      {selectedAccount.readingDate
                        ? new Date(selectedAccount.readingDate).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Average Usage</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedAccount.averageUsage}
                    </span>
                  </div>
                  {/* <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Check Account Number</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedAccount.accountNumber}</span>
                  </div> */}
                </div>
              </div>

              {/* Status Indicators */}
              <div className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2Icon className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Status</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={`rounded-md p-3 ${selectedAccount.isRead ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-700/50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Read</span>
                      <div
                        className={`h-2 w-2 rounded-full ${selectedAccount.isRead ? "bg-green-500" : "bg-gray-400"}`}
                      ></div>
                    </div>
                  </div>
                  <div
                    className={`rounded-md p-3 ${selectedAccount.isCompleted ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-700/50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Completed</span>
                      <div
                        className={`h-2 w-2 rounded-full ${selectedAccount.isCompleted ? "bg-green-500" : "bg-gray-400"}`}
                      ></div>
                    </div>
                  </div>
                  <div
                    className={`rounded-md p-3 ${selectedAccount.isCommitted ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-700/50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Committed</span>
                      <div
                        className={`h-2 w-2 rounded-full ${selectedAccount.isCommitted ? "bg-green-500" : "bg-gray-400"}`}
                      ></div>
                    </div>
                  </div>
                  <div
                    className={`rounded-md p-3 ${selectedAccount.isPosted ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-700/50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Posted</span>
                      <div
                        className={`h-2 w-2 rounded-full ${selectedAccount.isPosted ? "bg-green-500" : "bg-gray-400"}`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meter Reader */}
              <div className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-purple-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Meter Reader</h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-300">
                    <span className="text-lg font-bold">
                      {selectedAccount &&
                        selectedAccount.meterReader &&
                        selectedAccount.meterReader.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .substring(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {selectedAccount &&
                        selectedAccount.meterReader &&
                        selectedAccount.meterReader.name.trim()}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      ID:{" "}
                      {selectedAccount &&
                        selectedAccount.meterReader &&
                        selectedAccount.meterReader.id.substring(0, 8)}
                      ...
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Remarks Section */}
            <div className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <MessageSquareTextIcon className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Remarks</h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Primary Remarks
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                    {selectedAccount.remarks || (
                      <span className="text-gray-400 italic dark:text-gray-500">
                        No primary remarks provided
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Additional Remarks
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                    {selectedAccount.additionalRemarks || (
                      <span className="text-gray-400 italic dark:text-gray-500">No additional remarks</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button
              className="rounded-lg px-5 py-2 font-medium text-white dark:hover:brightness-75"
              onClick={() => {
                setAccountDetailsDialogIsOpen(false);
              }}
            >
              Close Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
