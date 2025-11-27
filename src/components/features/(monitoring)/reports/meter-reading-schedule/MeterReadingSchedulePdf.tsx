"use client";

import { FC, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, parse } from "date-fns";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { BilledMeterReadingSchedule } from "@mr/lib/types/schedule";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { PdfHeader } from "../PdfHeader";
import { ZonebookWithDates } from "@mr/lib/types/zonebook";

type ScheduleTableProps = {
  yearMonth: string;
};

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 5,
    textAlign: "center",
  },
  title: {
    fontSize: 11,
    marginBottom: 1,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 10,
    marginBottom: 1,
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    minHeight: 20,
  },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
    padding: 5,
    justifyContent: "center",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  cellText: {
    fontSize: 8,
    textAlign: "center",
  },
  spacerRow: {
    height: 20,
  },
  daySeparator: {
    height: 2,
    backgroundColor: "#000000",
    width: "100%",
  },

  // Width Styles
  w100: { width: "100%" },
  w95: { width: "95%" },
  w90: { width: "90%" },
  w85: { width: "85%" },
  w80: { width: "80%" },
  w75: { width: "75%" },
  w70: { width: "70%" },
  w65: { width: "65%" },
  w60: { width: "60%" },
  w55: { width: "55%" },
  w50: { width: "50%" },
  w40: { width: "40%" },
  w46_2: { width: "46.2%" },
  w35: { width: "35%" },
  w23_8: { width: "23.8%" },
  w20: { width: "20%" },
  w18: { width: "18%" },
  w15: { width: "15%" },
  w10: { width: "10%" },
  w7_5: { width: "7.5%" },
  w6: { width: "6%" },
  w5: { width: "5%" },
});

// Rows per page configuration
const FIRST_PAGE_ROWS = 20; // Exactly 18 rows total
const OTHER_PAGES_ROWS = 26; // Exactly 28 rows total

// PDF Document Component with pagination
const SchedulePDF: FC<{
  data: BilledMeterReadingSchedule[];
  yearMonth: string;
  // dayNumbers: number[];
}> = ({ data, yearMonth }) => {
  const formatDate = (yearMonth: string) => {
    const newDate = parse(yearMonth, "yyyy-MM", new Date());
    return format(newDate, "MMMM, yyyy");
  };

  // Group data by day to keep days together
  const groupDataByDay = () => {
    const dayGroups: Array<{
      day: number;
      dayNumber: number;
      rows: Array<{
        type: "data";
        content: {
          entry: BilledMeterReadingSchedule;
          dayNumber: number;
          meterReader?: { name: string; zoneBooks?: any[] };
          isNoMeterReader: boolean;
          originalIndex: number;
        };
      }>;
    }> = [];

    data.forEach((entry, idx) => {
      const calendarDay = new Date(entry.readingDate).getDate();
      const sequentialDayNumber = entry.day as number | null; // From API
      const meterReaders = entry.meterReaders || [];

      // Find existing day group or create new one
      let dayGroup = dayGroups.find((group) => group.day === calendarDay);
      if (!dayGroup) {
        dayGroup = {
          day: calendarDay,
          dayNumber: sequentialDayNumber!, // Use the day number from API
          rows: [],
        };
        dayGroups.push(dayGroup);
      }

      // Handle entries with no meter readers
      if (meterReaders.length === 0) {
        dayGroup.rows.push({
          type: "data",
          content: {
            entry,
            dayNumber: sequentialDayNumber!, // Use the day number from API
            isNoMeterReader: true,
            originalIndex: idx,
          },
        });
      } else {
        // Handle entries with meter readers
        meterReaders.forEach((reader) => {
          dayGroup!.rows.push({
            type: "data",
            content: {
              entry,
              dayNumber: sequentialDayNumber!, // Use the day number from API
              meterReader: reader,
              isNoMeterReader: false,
              originalIndex: idx,
            },
          });
        });
      }
    });

    // Sort groups by calendar day to maintain chronological order
    return dayGroups.sort((a, b) => a.day - b.day);
  };

  const dayGroups = groupDataByDay();

  // Create pages with exact row counts
  const createPages = () => {
    const pages: Array<{
      rows: any[];
      hasHeader: boolean;
    }> = [];

    let currentDayIndex = 0;
    let currentRowIndex = 0;

    // First page - exactly 19 rows total
    const firstPage = { rows: [] as any[], hasHeader: true };
    let firstPageRowCount = 1; // Start with 1 for the table header

    // Fill first page
    while (currentDayIndex < dayGroups.length && firstPageRowCount < FIRST_PAGE_ROWS) {
      const dayGroup = dayGroups[currentDayIndex];
      const remainingRows = FIRST_PAGE_ROWS - firstPageRowCount;

      // Add day separator (except for first day)
      if (currentDayIndex > 0 && currentRowIndex === 0) {
        if (remainingRows >= 1) {
          // Check if there's space for separator
          firstPage.rows.push({ type: "daySeparator" });
          firstPageRowCount += 1;
        }
      }

      // Add as many rows from this day group as possible
      const rowsToAdd = Math.min(dayGroup.rows.length - currentRowIndex, remainingRows);

      for (let i = 0; i < rowsToAdd; i++) {
        firstPage.rows.push(dayGroup.rows[currentRowIndex + i]);
        firstPageRowCount += 1;
      }

      currentRowIndex += rowsToAdd;

      // If we've processed all rows in this day group, move to next day
      if (currentRowIndex >= dayGroup.rows.length) {
        currentDayIndex++;
        currentRowIndex = 0;
      } else {
        // Day group doesn't fit completely, break to next page
        break;
      }
    }

    pages.push(firstPage);

    // Subsequent pages - exactly 28 rows each
    while (currentDayIndex < dayGroups.length) {
      const page = { rows: [] as any[], hasHeader: false };
      let pageRowCount = 0;

      // Fill page
      while (currentDayIndex < dayGroups.length && pageRowCount < OTHER_PAGES_ROWS) {
        const dayGroup = dayGroups[currentDayIndex];
        const remainingRows = OTHER_PAGES_ROWS - pageRowCount;

        // Add day separator if we're starting a new day and page is not empty
        if (currentRowIndex === 0 && page.rows.length > 0) {
          if (remainingRows >= 1) {
            // Check if there's space for separator
            page.rows.push({ type: "daySeparator" });
            pageRowCount += 1;
          }
        }

        // Add as many rows from this day group as possible
        const rowsToAdd = Math.min(dayGroup.rows.length - currentRowIndex, remainingRows);

        for (let i = 0; i < rowsToAdd; i++) {
          page.rows.push(dayGroup.rows[currentRowIndex + i]);
          pageRowCount += 1;
        }

        currentRowIndex += rowsToAdd;

        // If we've processed all rows in this day group, move to next day
        if (currentRowIndex >= dayGroup.rows.length) {
          currentDayIndex++;
          currentRowIndex = 0;
        } else {
          // Day group doesn't fit completely, break to next page
          break;
        }
      }

      pages.push(page);
    }

    return pages;
  };

  const pages = createPages();

  // Table Header Component
  const TableHeader = () => (
    <View style={[styles.tableRow, styles.w100]}>
      <View style={[styles.tableColHeader, styles.w5]}>
        <Text style={styles.headerText}>DAY</Text>
      </View>
      <View style={[styles.tableColHeader, styles.w5]}>
        <Text style={styles.headerText}>DATE</Text>
      </View>
      <View style={[styles.tableColHeader, styles.w5]}>
        <Text style={styles.headerText}>DUE</Text>
      </View>
      <View style={[styles.tableColHeader, styles.w5]}>
        <Text style={styles.headerText}>DISC</Text>
      </View>
      <View style={[styles.tableColHeader, styles.w15]}>
        <Text style={styles.headerText}>METER READER</Text>
      </View>
      <View style={[styles.tableColHeader, styles.w15]}>
        <Text style={styles.headerText}>ZONE/BOOK</Text>
      </View>
      <View style={[styles.tableColHeader, styles.w35]}>
        <Text style={styles.headerText}>AREA</Text>
      </View>
      <View style={[styles.tableColHeader, styles.w10]}>
        <Text style={styles.headerText}>BILLED</Text>
      </View>
      <View style={[styles.tableColHeader, styles.w10]}>
        <Text style={styles.headerText}>REMARKS</Text>
      </View>
    </View>
  );

  // Render a data row
  const DataRow = ({ item, rowIndex }: { item: any; rowIndex: number }) => {
    const readingDate = new Date(item.entry.readingDate);

    return (
      <View style={[styles.tableRow, styles.w100]} key={`data-${rowIndex}`}>
        <View style={[styles.tableCol, styles.w5]}>
          <Text style={styles.cellText}>{item.dayNumber}</Text>
        </View>
        <View style={[styles.tableCol, styles.w5]}>
          <Text style={styles.cellText}>{item.entry.readingDate ? format(readingDate, "MM/dd") : "N/A"}</Text>
        </View>
        <View style={[styles.tableCol, styles.w5]}>
          <Text style={styles.cellText}>
            {item.entry.dueDate
              ? format(
                  Array.isArray(item.entry.dueDate) ? item.entry.dueDate[0] : item.entry.dueDate,
                  "MM/dd",
                )
              : "N/A"}
          </Text>
        </View>
        <View style={[styles.tableCol, styles.w5]}>
          <Text style={styles.cellText}>
            {item.entry.disconnectionDate
              ? format(
                  Array.isArray(item.entry.disconnectionDate)
                    ? item.entry.disconnectionDate[0]
                    : item.entry.disconnectionDate,
                  "MM/dd",
                )
              : "N/A"}
          </Text>
        </View>
        <View style={[styles.tableCol, styles.w15]}>
          <Text style={[styles.cellText, { textAlign: "left" }]}>
            {item.isNoMeterReader ? "-" : item.meterReader?.name || "N/A"}
          </Text>
        </View>
        <View style={[styles.tableCol, styles.w15]}>
          <Text style={styles.cellText}>
            {item.isNoMeterReader
              ? "-"
              : item.meterReader?.zoneBooks && item.meterReader.zoneBooks.length > 0
                ? item.meterReader.zoneBooks.map(
                    (zb: ZonebookWithDates, zbIdx: number) =>
                      `${zb.zone}-${zb.book}${item.meterReader!.zoneBooks!.length > zbIdx + 1 ? ", " : ""}`,
                  )
                : "-"}
          </Text>
        </View>
        <View style={[styles.tableCol, styles.w35]}>
          <Text style={[styles.cellText, { fontSize: 7 }]}>
            {item.isNoMeterReader
              ? "-"
              : item.meterReader?.zoneBooks && item.meterReader.zoneBooks.length > 0
                ? item.meterReader.zoneBooks
                    .map((zb: ZonebookWithDates) => zb.area?.name) // Extract area names
                    .filter((areaName: string) => areaName && areaName.trim() !== "") // Remove empty/null area names
                    .join("/  ") // Join with commas only for non-empty values
                : "-"}
          </Text>
        </View>
        <View style={[styles.tableCol, styles.w10]}>
          <Text style={styles.cellText}>{item.isNoMeterReader ? "-" : "0"}</Text>
        </View>
        <View style={[styles.tableCol, styles.w10]}>
          <Text style={styles.cellText}>{item.isNoMeterReader ? "-" : "N/A"}</Text>
        </View>
      </View>
    );
  };

  // If no data, show empty state
  if (dayGroups.length === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page} orientation="landscape">
          <PdfHeader />
          <View style={styles.header}>
            <Text style={[{ fontWeight: "bold", fontSize: "9" }]}>METER READING SCHEDULE</Text>
            <Text style={styles.title}>{formatDate(yearMonth)}</Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      {pages.map((page, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page} orientation="landscape">
          {/* Show header only on first page */}
          {page.hasHeader && (
            <>
              <PdfHeader />
              <View style={styles.header}>
                <Text style={[{ fontWeight: "bold", fontSize: "9" }]}>METER READING SCHEDULE</Text>
                <Text style={styles.title}>{formatDate(yearMonth)}</Text>
              </View>
            </>
          )}

          {/* Table */}
          <View style={styles.table}>
            {/* Table Header - ONLY on first page */}
            {page.hasHeader && <TableHeader />}

            {/* Render rows for this page */}
            {page.rows.map((row, rowIndex) => {
              if (row.type === "daySeparator") {
                return <View style={styles.daySeparator} key={`separator-${pageIndex}-${rowIndex}`} />;
              } else {
                return (
                  <DataRow item={row.content!} rowIndex={rowIndex} key={`data-${pageIndex}-${rowIndex}`} />
                );
              }
            })}
          </View>
        </Page>
      ))}
    </Document>
  );
};

export const MeterReadingSchedulePdf: FC<ScheduleTableProps> = ({ yearMonth }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const { data, isLoading, isError } = useQuery<BilledMeterReadingSchedule[]>({
    queryKey: ["schedule", yearMonth],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/schedules?date=${yearMonth}`);
      return res.data;
    },
    enabled: !!yearMonth,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Function to compute day numbers with weekend grouping
  // const computeDayNumbers = (entries: BilledMeterReadingSchedule[]) => {
  //   const dayNumbers: number[] = [];
  //   let currentDayNumber = 0;

  //   for (let i = 0; i < entries.length; i++) {
  //     const currentDate = new Date(entries[i].readingDate);

  //     if (i === 0) {
  //       currentDayNumber = 1;
  //       dayNumbers.push(currentDayNumber);
  //       continue;
  //     }

  //     const previousDate = new Date(entries[i - 1].readingDate);

  //     if (isSunday(currentDate) && isSaturday(previousDate)) {
  //       dayNumbers.push(currentDayNumber);
  //     } else {
  //       currentDayNumber++;
  //       dayNumbers.push(currentDayNumber);
  //     }
  //   }

  //   return dayNumbers;
  // };

  // Generate PDF when data is loaded
  useEffect(() => {
    if (data && data.length > 0) {
      generatePdfPreview();
    }
  }, [data, yearMonth]);

  const generatePdfPreview = async () => {
    if (!data || data.length === 0) return;

    setIsGeneratingPdf(true);
    try {
      // Clean up previous URL if exists
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      const sortedData = data.sort((a, b) => (a.readingDate > b.readingDate ? 1 : -1));
      // const dayNumbers = computeDayNumbers(sortedData);

      const blob = await pdf(<SchedulePDF data={sortedData} yearMonth={yearMonth} />).toBlob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error generating PDF preview:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Clean up URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <LoadingSpinner />
        <span className="ml-2">Loading Schedule Data...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="text-center text-red-500">
          <div className="text-lg font-semibold">Failed to load schedule</div>
          <div className="mt-2 text-sm">Please try again later</div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-lg font-semibold">No schedule data found</div>
          <div className="mt-2 text-sm">Please input a valid year-month format (YYYY-MM)</div>
        </div>
      </div>
    );
  }

  // Sort data by reading date
  const sortedData = data.sort((a, b) => (a.readingDate > b.readingDate ? 1 : -1));
  // const dayNumbers = computeDayNumbers(sortedData);

  return (
    <div className="flex flex-col p-8">
      {/* PDF Preview Section */}
      <div className="mb-6">
        <div className="h-[44rem] rounded-lg bg-white shadow-lg">
          <div className="h-full bg-gray-50">
            {isGeneratingPdf ? (
              <div className="flex h-[44rem] items-center justify-center">
                <div className="text-center">
                  <LoadingSpinner className="mx-auto mb-2 h-8 w-8" />
                  <p className="text-gray-600">Generating PDF preview...</p>
                </div>
              </div>
            ) : pdfUrl ? (
              <iframe src={pdfUrl} className="h-full w-full border-0" title="PDF Preview" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg
                    className="mx-auto mb-2 h-12 w-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p>PDF preview will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
