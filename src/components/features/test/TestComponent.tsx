"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@mr/components/ui/AlertDialog";
import { Button } from "@mr/components/ui/Button";
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  InfoIcon,
  MessageSquareIcon,
  MessageSquareTextIcon,
  Signal,
  UserIcon,
} from "lucide-react";
import { useState } from "react";

export const TestComponent = () => {
  const [accountDetailsDialogIsOpen, setAccountDetailsDialogIsOpen] = useState<boolean>(false);

  const json = {
    readingDate: null,
    accountNumber: "018608",
    checkDigit: "3",
    accountName: "DEMONTANO, SERGIO/PHIL N.",
    zone: "2",
    book: "11",
    currentReading: 0,
    previousReading: 433,
    averageUsage: 18,
    billedAmount: 0,
    isRead: false,
    isPosted: false,
    isCompleted: false,
    isCommitted: false,
    remarks: "",
    additionalRemarks: "",
    meterReader: {
      id: "3c2f91fe-db2b-4003-bfab-40f5b67813f5",
      name: "Oliva, Jeramel R. ",
    },
  };

  return (
    <>
      <div className="flex h-full items-center justify-center">
        <Button
          className="dark:text-white"
          onClick={() => setAccountDetailsDialogIsOpen(!accountDetailsDialogIsOpen)}
        >
          Open
        </Button>
      </div>
      <AlertDialog open={accountDetailsDialogIsOpen} onOpenChange={setAccountDetailsDialogIsOpen}>
        <AlertDialogContent className="flex max-h-[95%] flex-col overflow-y-auto sm:max-w-5xl lg:max-w-[65%] dark:bg-gray-900 dark:text-gray-100">
          <AlertDialogHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <AlertDialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Account Details
              </AlertDialogTitle>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  #{json.accountNumber}-{json.checkDigit}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Zone {json.zone} / Book {json.book}
                </div>
              </div>
            </div>
          </AlertDialogHeader>

          <div className="space-y-6 py-3">
            {/* Account Header with Stats */}
            <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{json.accountName}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="grid grid-cols-4 gap-2">
                  <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-800">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Current Reading</div>
                      <div className="text-lg font-bold">{json.currentReading}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-800">
                    <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Previous</div>
                      <div className="text-lg font-bold text-gray-600 dark:text-gray-300">
                        {json.previousReading}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-800">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Consumption</div>
                      <div className="text-lg font-bold">
                        {json.currentReading === 0
                          ? "-"
                          : Math.max(0, json.currentReading - json.previousReading)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-center rounded-lg bg-gradient-to-r from-blue-50 to-white p-4 dark:from-blue-950/20 dark:to-gray-800">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      ₱ {json.billedAmount.toFixed(2)}
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
                      className={`font-medium ${json.readingDate ? "text-gray-900 dark:text-white" : "text-gray-400"}`}
                    >
                      {json.readingDate ? new Date(json.readingDate).toLocaleDateString() : "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Average Usage</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{json.averageUsage}</span>
                  </div>
                  {/* <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Check Account Number</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{json.accountNumber}</span>
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
                    className={`rounded-md p-3 ${json.isRead ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-700/50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Read</span>
                      <div
                        className={`h-2 w-2 rounded-full ${json.isRead ? "bg-green-500" : "bg-gray-400"}`}
                      ></div>
                    </div>
                  </div>
                  <div
                    className={`rounded-md p-3 ${json.isPosted ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-700/50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Posted</span>
                      <div
                        className={`h-2 w-2 rounded-full ${json.isPosted ? "bg-green-500" : "bg-gray-400"}`}
                      ></div>
                    </div>
                  </div>
                  <div
                    className={`rounded-md p-3 ${json.isCompleted ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-700/50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Completed</span>
                      <div
                        className={`h-2 w-2 rounded-full ${json.isCompleted ? "bg-green-500" : "bg-gray-400"}`}
                      ></div>
                    </div>
                  </div>
                  <div
                    className={`rounded-md p-3 ${json.isCommitted ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-700/50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Committed</span>
                      <div
                        className={`h-2 w-2 rounded-full ${json.isCommitted ? "bg-green-500" : "bg-gray-400"}`}
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
                      {json.meterReader.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .substring(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {json.meterReader.name.trim()}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      ID: {json.meterReader.id.substring(0, 8)}...
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
                    {json.remarks || (
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
                    {json.additionalRemarks || (
                      <span className="text-gray-400 italic dark:text-gray-500">No additional remarks</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="border-t pt-4">
            <AlertDialogCancel className="rounded-lg px-5 py-2 font-medium hover:bg-gray-100 dark:hover:bg-gray-800">
              Close Details
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
