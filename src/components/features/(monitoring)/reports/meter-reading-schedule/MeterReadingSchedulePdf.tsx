"use client";

import { FC, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, isSaturday, isSunday, parse } from "date-fns";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { BilledMeterReadingSchedule } from "@mr/lib/types/schedule";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

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
    // paddingBottom: 10,
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
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
    color: "#666",
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

// PDF Document Component
const SchedulePDF: FC<{
  data: BilledMeterReadingSchedule[];
  yearMonth: string;
  dayNumbers: number[];
}> = ({ data, yearMonth, dayNumbers }) => {
  const formatDate = (yearMonth: string) => {
    const newDate = parse(yearMonth, "yyyy-MM", new Date());
    return format(newDate, "MMMM, yyyy");
  };
  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.header}>
          <Text style={styles.subtitle}>Republic of the Philippines</Text>
          <Text style={styles.title}>GENERAL SANTOS CITY WATER DISTRICT</Text>
          <Text style={styles.subtitle}>E. Fernandez St., Lagao, GSC</Text>
          <Text style={[styles.subtitle]}>Tel Nos. (083) 552-3824, 301-0542, 554-7231, 553-4960</Text>
        </View>
        <View style={styles.header}>
          <Text style={[{ fontWeight: "bold", fontSize: "9" }]}>METER READING SCHEDULE</Text>
          <Text style={styles.title}>{formatDate(yearMonth)}</Text>
        </View>

        <View style={styles.table}>
          {/* Table Header */}
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

          {/* Table Rows */}
          {data.map((entry, idx) => {
            const readingDate = new Date(entry.readingDate);
            const dayNumber = dayNumbers[idx];
            const meterReaders = entry.meterReaders || [];

            if (meterReaders.length === 0) {
              return (
                <View style={[styles.tableRow, styles.w100]} key={idx}>
                  <View style={[styles.tableCol, styles.w5]}>
                    <Text style={styles.cellText}>{dayNumber}</Text>
                  </View>
                  <View style={[styles.tableCol, styles.w5]}>
                    <Text style={styles.cellText}>
                      {entry.readingDate ? format(readingDate, "MMM dd, yyyy (EEE)") : "N/A"}
                    </Text>
                  </View>
                  <View style={[styles.tableCol, styles.w5]}>
                    <Text style={styles.cellText}>
                      {entry.dueDate
                        ? format(
                            Array.isArray(entry.dueDate) ? entry.dueDate[0] : entry.dueDate,
                            "MMM dd, yyyy",
                          )
                        : "N/A"}
                    </Text>
                  </View>
                  <View style={[styles.tableCol, styles.w5]}>
                    <Text style={styles.cellText}>
                      {entry.disconnectionDate
                        ? format(
                            Array.isArray(entry.disconnectionDate)
                              ? entry.disconnectionDate[0]
                              : entry.disconnectionDate,
                            "MMM dd, yyyy",
                          )
                        : "N/A"}
                    </Text>
                  </View>
                  <View style={[styles.tableCol, styles.w15]}>
                    <Text style={styles.cellText}>-</Text>
                  </View>
                  <View style={[styles.tableCol, styles.w15]}>
                    <Text style={styles.cellText}>-</Text>
                  </View>
                  <View style={[styles.tableCol, styles.w35]}>
                    <Text style={styles.cellText}>-</Text>
                  </View>
                  <View style={[styles.tableCol, styles.w10]}>
                    <Text style={styles.cellText}>-</Text>
                  </View>{" "}
                  <View style={[styles.tableCol, styles.w10]}>
                    <Text style={styles.cellText}>-</Text>
                  </View>
                </View>
              );
            }

            return meterReaders.map((reader, readerIdx) => (
              <View style={[styles.tableRow, styles.w100]} key={`${idx}-${readerIdx}`}>
                <View style={[styles.tableCol, styles.w5]}>
                  <Text style={styles.cellText}>{dayNumber}</Text>
                </View>
                <View style={[styles.tableCol, styles.w5]}>
                  <Text style={styles.cellText}>
                    {entry.readingDate ? format(readingDate, "MM/dd") : "N/A"}
                  </Text>
                </View>
                <View style={[styles.tableCol, styles.w5]}>
                  <Text style={styles.cellText}>
                    {entry.dueDate
                      ? format(Array.isArray(entry.dueDate) ? entry.dueDate[0] : entry.dueDate, "MM/dd")
                      : "N/A"}
                  </Text>
                </View>
                <View style={[styles.tableCol, styles.w5]}>
                  <Text style={styles.cellText}>
                    {entry.disconnectionDate
                      ? format(
                          Array.isArray(entry.disconnectionDate)
                            ? entry.disconnectionDate[0]
                            : entry.disconnectionDate,
                          "MM/dd",
                        )
                      : "N/A"}
                  </Text>
                </View>
                <View style={[styles.tableCol, styles.w15]}>
                  <Text style={[styles.cellText, { textAlign: "left" }]}>{reader.name}</Text>
                </View>
                <View style={[styles.tableCol, styles.w15]}>
                  <Text style={styles.cellText}>
                    {reader.zoneBooks && reader.zoneBooks.length > 0
                      ? reader.zoneBooks.map(
                          (zb, idx) =>
                            `${zb.zone}-${zb.book}${reader.zoneBooks.length > idx + 1 ? ", " : ""}`,
                        )
                      : "-"}
                  </Text>
                </View>
                <View style={[styles.tableCol, styles.w35]}>
                  <Text style={styles.cellText}>-</Text>
                </View>
                <View style={[styles.tableCol, styles.w10]}>
                  <Text style={styles.cellText}>0</Text>
                </View>
                <View style={[styles.tableCol, styles.w10]}>
                  <Text style={styles.cellText}>N/A</Text>
                </View>
              </View>
            ));
          })}
        </View>
        <Text style={styles.footer}>Total Records: {data.length} | Generated by MR System</Text>
      </Page>
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
  const computeDayNumbers = (entries: BilledMeterReadingSchedule[]) => {
    const dayNumbers: number[] = [];
    let currentDayNumber = 0;

    for (let i = 0; i < entries.length; i++) {
      const currentDate = new Date(entries[i].readingDate);

      if (i === 0) {
        currentDayNumber = 1;
        dayNumbers.push(currentDayNumber);
        continue;
      }

      const previousDate = new Date(entries[i - 1].readingDate);

      if (isSunday(currentDate) && isSaturday(previousDate)) {
        dayNumbers.push(currentDayNumber);
      } else {
        currentDayNumber++;
        dayNumbers.push(currentDayNumber);
      }
    }

    return dayNumbers;
  };

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
      const dayNumbers = computeDayNumbers(sortedData);

      const blob = await pdf(
        <SchedulePDF data={sortedData} yearMonth={yearMonth} dayNumbers={dayNumbers} />,
      ).toBlob();
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
  const dayNumbers = computeDayNumbers(sortedData);

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

      {/* Download Section */}
      {/* <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-800">Download Schedule</h3>
          <p className="mb-4 text-sm text-gray-600">Download the PDF document to your device</p>

          <PDFDownloadLink
            document={<SchedulePDF data={sortedData} yearMonth={yearMonth} dayNumbers={dayNumbers} />}
            fileName={`meter-reading-schedule-${yearMonth}.pdf`}
            className="inline-flex min-w-[200px] items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
          >
            {({ loading }) => (
              <>
                {loading ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Preparing Download...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download PDF
                  </>
                )}
              </>
            )}
          </PDFDownloadLink>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="text-center text-sm text-gray-500">
            <p>The PDF includes all schedule details with professional formatting</p>
            <p className="mt-1">Landscape orientation optimized for table viewing</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};
