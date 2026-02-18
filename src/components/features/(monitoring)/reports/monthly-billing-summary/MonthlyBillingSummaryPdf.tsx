"use client";

import { Spinner } from "@mr/components/ui/Spinner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FunctionComponent, JSX, useEffect, useState } from "react";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { format, parse } from "date-fns";
import { PdfReportHeader } from "../PdfReportHeader";
import { PdfBillingSummaryHeader } from "../PdfBillingSummaryHeader";

type MonthlyBillingSummaryPdfProps = {
  yearMonth: string;
};

type RawBookRecord = {
  zone: string; // "01", "02", "05", "08", "12", "15", "22", "35", "45", "55"
  book: string; // "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"
  count: number;
  usage: number;
  billAmount: number;
  seniorAmount: number;
};

type InputDataType = RawBookRecord[];

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    paddingVertical: 5,
    paddingHorizontal: 20,
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
    borderStyle: "dotted",
    borderWidth: 1,
    borderRight: 0,
    borderLeft: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    minHeight: 2,
  },
  tableColHeader: {
    width: "20%",
    borderTopStyle: "dotted",
    borderBottomStyle: "dotted",
    borderRightStyle: "solid",
    borderLeftStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#ffffffbc",
    padding: 5,
    justifyContent: "center",
  },
  tableCol: {
    width: "20%",
    // borderStyle: "solid",
    // borderWidth: 1,
    // borderLeftWidth: 0,
    // borderTopWidth: 0,
    padding: 5,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "right",
  },
  cellText: {
    fontSize: 8,
    textAlign: "right",
  },
  spacerRow: {
    height: 2,
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
  w25: { width: "25%" },
  w23_8: { width: "23.8%" },
  w22_5: { width: "22.5%" },
  w20: { width: "20%" },
  w17_5: { width: "17.5%" },
  w18: { width: "18%" },
  w15: { width: "15%" },
  w12_5: { width: "12.5%" },
  w10: { width: "10%" },
  w9: { width: "9%" },
  w7_5: { width: "7.5%" },
  w6: { width: "6%" },
  w5: { width: "5%" },
});

interface MonthlyBillingSummaryPDFProps {
  data: InputDataType;
  yearMonth: string;
}

const MonthlyBillingSummaryPDF: FunctionComponent<MonthlyBillingSummaryPDFProps> = ({
  data,
  yearMonth,
}): JSX.Element => {
  const formatDate = (yearMonth: string) => {
    const newDate = parse(yearMonth, "yyyy-MM", new Date());
    return format(newDate, "MMMM yyyy");
  };

  // Table Header Component
  const TableHeader = () => (
    <View style={[styles.tableRow, styles.w100, { borderLeft: 0, borderRight: 0 }]}>
      <View
        style={[
          styles.tableColHeader,
          styles.w12_5,
          { borderLeft: 0, borderRight: 0, justifyContent: "flex-start" },
        ]}
      >
        <Text style={[styles.headerText, { textAlign: "left" }]}>Zone - Book</Text>
      </View>
      <View style={[styles.tableColHeader, styles.w17_5, { borderLeft: 0, borderRight: 0 }]}>
        <Text style={styles.headerText}>Count</Text>
      </View>
      <View style={[styles.tableColHeader, styles.w25, { borderLeft: 0, borderRight: 0 }]}>
        <Text style={styles.headerText}>Usage (CUM)</Text>
      </View>
      <View style={[styles.tableColHeader, styles.w22_5, { borderLeft: 0, borderRight: 0 }]}>
        <Text style={styles.headerText}>Bill Amount</Text>
      </View>
      <View style={[styles.tableColHeader, styles.w22_5, { borderLeft: 0, borderRight: 0 }]}>
        <Text style={styles.headerText}>Senior Amount</Text>
      </View>
    </View>
  );

  const BillAmountTableHeader = () => (
    <View style={[styles.tableRow, styles.w100, { borderLeft: 0, borderRight: 0 }]}>
      <View
        style={[
          styles.tableColHeader,
          styles.w15,
          { borderLeft: 0, borderRight: 0, justifyContent: "flex-start" },
        ]}
      >
        <Text style={[styles.headerText, { textAlign: "left" }]}>Classification</Text>
      </View>
      <View style={[styles.tableColHeader, styles.w9, { borderLeft: 0, borderRight: 0 }]}>
        <Text style={styles.headerText}>3/8</Text>
      </View>
      <View style={[styles.tableColHeader, styles.w9, { borderLeft: 0, borderRight: 0 }]}>
        <Text style={styles.headerText}>1/2</Text>
      </View>
      <View style={[styles.tableColHeader, styles.w9, { borderLeft: 0, borderRight: 0 }]}>
        <Text style={styles.headerText}>3/4</Text>
      </View>
      <View style={[styles.tableColHeader, styles.w9, { borderLeft: 0, borderRight: 0 }]}>
        <Text style={styles.headerText}>1</Text>
      </View>
      <View style={[styles.tableColHeader, styles.w9, { borderLeft: 0, borderRight: 0 }]}>
        <Text style={styles.headerText}>1 1/2</Text>
      </View>
      <View style={[styles.tableColHeader, styles.w9, { borderLeft: 0, borderRight: 0 }]}>
        <Text style={styles.headerText}>2</Text>
      </View>
      <View style={[styles.tableColHeader, styles.w9, { borderLeft: 0, borderRight: 0 }]}>
        <Text style={styles.headerText}>2 1/2</Text>
      </View>
      <View style={[styles.tableColHeader, styles.w9, { borderLeft: 0, borderRight: 0 }]}>
        <Text style={styles.headerText}>3</Text>
      </View>
      <View style={[styles.tableColHeader, styles.w9, { borderLeft: 0, borderRight: 0 }]}>
        <Text style={styles.headerText}>4</Text>
      </View>
      <View
        style={[
          styles.tableColHeader,
          styles.w10,
          { borderLeft: 0, borderRight: 0, justifyContent: "flex-start" },
        ]}
      >
        <Text style={[styles.headerText, { textAlign: "left" }]}>Total</Text>
      </View>
    </View>
  );

  const generateMonthlyReportWithDetails = (data: InputDataType, reportDate = new Date()) => {
    // Group by zone first
    const zoneMap = new Map();

    // First pass: group all records by zone
    data.forEach((record) => {
      const zone = record.zone;
      if (!zoneMap.has(zone)) {
        zoneMap.set(zone, {
          zone,
          books: [],
          zoneSummary: {
            totalCount: 0,
            totalUsage: 0,
            totalBillAmount: 0,
            totalSeniorAmount: 0,
            bookCount: 0,
          },
        });
      }

      const zoneData = zoneMap.get(zone);

      // Add the detailed book record
      zoneData.books.push({
        book: record.book,
        count: record.count,
        usage: record.usage,
        billAmount: record.billAmount,
        seniorAmount: record.seniorAmount,
      });

      // Update zone summary
      zoneData.zoneSummary.totalCount += record.count;
      zoneData.zoneSummary.totalUsage += record.usage;
      zoneData.zoneSummary.totalBillAmount += record.billAmount;
      zoneData.zoneSummary.totalSeniorAmount += record.seniorAmount;
      zoneData.zoneSummary.bookCount++;
    });

    // Calculate grand totals
    let grandTotals = {
      totalCount: 0,
      totalUsage: 0,
      totalBillAmount: 0,
      totalSeniorAmount: 0,
      totalBooks: 0,
    };

    // Convert map to array and calculate percentages
    const zones = Array.from(zoneMap.values()).map((zone) => {
      // Round the summary values
      zone.zoneSummary = {
        ...zone.zoneSummary,
        totalUsage: Math.round(zone.zoneSummary.totalUsage * 100) / 100,
        totalBillAmount: Math.round(zone.zoneSummary.totalBillAmount * 100) / 100,
        totalSeniorAmount: Math.round(zone.zoneSummary.totalSeniorAmount * 100) / 100,
      };

      // Add to grand totals
      grandTotals.totalCount += zone.zoneSummary.totalCount;
      grandTotals.totalUsage += zone.zoneSummary.totalUsage;
      grandTotals.totalBillAmount += zone.zoneSummary.totalBillAmount;
      grandTotals.totalSeniorAmount += zone.zoneSummary.totalSeniorAmount;
      grandTotals.totalBooks += zone.books.length;

      return zone;
    });

    // Sort zones by zone number
    zones.sort((a, b) => a.zone - b.zone);

    // Round grand totals
    grandTotals = {
      totalCount: grandTotals.totalCount,
      totalUsage: Math.round(grandTotals.totalUsage * 100) / 100,
      totalBillAmount: Math.round(grandTotals.totalBillAmount * 100) / 100,
      totalSeniorAmount: Math.round(grandTotals.totalSeniorAmount * 100) / 100,
      totalBooks: grandTotals.totalBooks,
    };

    // // Add percentages to each zone
    // zones.forEach((zone) => {
    //   zone.zoneSummary.percentageOfTotal = {
    //     count: ((zone.zoneSummary.totalCount / grandTotals.totalCount) * 100).toFixed(2) + "%",
    //     usage: ((zone.zoneSummary.totalUsage / grandTotals.totalUsage) * 100).toFixed(2) + "%",
    //     bill: ((zone.zoneSummary.totalBillAmount / grandTotals.totalBillAmount) * 100).toFixed(2) + "%",
    //     senior: ((zone.zoneSummary.totalSeniorAmount / grandTotals.totalSeniorAmount) * 100).toFixed(2) + "%",
    //   };

    //   // Sort books by book number
    //   zone.books.sort((a, b) => a.book - b.book);
    // });

    return {
      reportMetadata: {
        generatedAt: reportDate.toISOString(),
        reportMonth: reportDate.toISOString().slice(0, 7),
        reportPeriod: reportDate.toLocaleString("default", { month: "long", year: "numeric" }),
        totalZones: zones.length,
        totalBooks: grandTotals.totalBooks,
      },
      summary: {
        totalCount: grandTotals.totalCount,
        totalUsage: grandTotals.totalUsage,
        totalBillAmount: grandTotals.totalBillAmount,
        totalSeniorAmount: grandTotals.totalSeniorAmount,
      },
      zones: zones,
      analytics: {
        averagePerZone: {
          count: Math.round(grandTotals.totalCount / zones.length),
          usage: Math.round(grandTotals.totalUsage / zones.length),
          billAmount: Math.round(grandTotals.totalBillAmount / zones.length),
          seniorAmount: Math.round(grandTotals.totalSeniorAmount / zones.length),
        },
        averagePerBook: {
          usage: Math.round((grandTotals.totalUsage / grandTotals.totalBooks) * 100) / 100,
          billAmount: Math.round((grandTotals.totalBillAmount / grandTotals.totalBooks) * 100) / 100,
          seniorAmount: Math.round((grandTotals.totalSeniorAmount / grandTotals.totalBooks) * 100) / 100,
        },
      },
    };
  };

  // create pages with row
  const createPages = (reportData: any) => {
    const pages: Array<{
      rows: any[];
      zoneSummary?: any;
      pageNumber: number;
    }> = [];

    let currentPageRows: any[] = [];
    let currentZoneSummary: any = null;
    let currentZone: number | null = null;
    let currentZoneData: any = null;
    const MAX_ROWS_PER_PAGE = 30;

    // Helper to add zone summary row at the BOTTOM with dotted border
    const addZoneTotalRow = (zone: any) => {
      currentPageRows.push({
        type: "zoneTotal",
        zone: zone.zone,
        book: `${zone.zone} - Total`,
        count: zone.zoneSummary.totalCount
          ? zone.zoneSummary.totalCount.toLocaleString("en-US")
          : zone.zoneSummary.totalCount,
        usage: zone.zoneSummary.totalUsage
          ? zone.zoneSummary.totalUsage.toLocaleString("en-US")
          : zone.zoneSummary.totalUsage,
        billAmount: zone.zoneSummary.totalBillAmount
          ? zone.zoneSummary.totalBillAmount.toFixed(2).toLocaleString("en-US")
          : zone.zoneSummary.totalBillAmount,
        seniorAmount: zone.zoneSummary.totalSeniorAmount
          ? zone.zoneSummary.totalSeniorAmount.toFixed(2).toLocaleString("en-US")
          : zone.zoneSummary.totalSeniorAmount,
        isBold: false,
        backgroundColor: "#ffffff",
        borderTop: false,
        borderBottom: true,
        borderBottomStyle: "dotted", // ✅ Dotted border
      });
    };

    // Helper to add book row
    const addBookRow = (book: any, zone: number) => {
      currentPageRows.push({
        type: "book",
        zone: zone,
        book: book.book,
        count: book.count ? book.count.toLocaleString("en-US") : book.count,
        usage: book.usage ? book.usage.toLocaleString("en-US") : book.usage,
        billAmount: book.billAmount ? book.billAmount.toFixed(2).toLocaleString("en-US") : book.billAmount,
        seniorAmount: book.seniorAmount
          ? book.seniorAmount.toFixed(2).toLocaleString("en-US")
          : book.seniorAmount,
        isBold: false,
      });
    };

    // Helper to start new page
    const startNewPage = (zone?: any) => {
      if (currentPageRows.length > 0) {
        pages.push({
          rows: [...currentPageRows],
          zoneSummary: currentZoneSummary,
          pageNumber: pages.length + 1,
        });
        currentPageRows = [];
      }

      if (zone) {
        currentZone = zone.zone;
        currentZoneSummary = zone.zoneSummary;
        currentZoneData = zone;
      }
    };

    // Process each zone
    reportData.zones.forEach((zone: any, zoneIndex: number) => {
      const zoneHasStarted = currentZone === zone.zone;

      if (!zoneHasStarted) {
        if (currentPageRows.length >= MAX_ROWS_PER_PAGE - 2) {
          startNewPage();
        }

        currentZone = zone.zone;
        currentZoneSummary = zone.zoneSummary;
        currentZoneData = zone;
      }

      // Add all books for this zone
      zone.books.forEach((book: any, bookIndex: number) => {
        if (currentPageRows.length >= MAX_ROWS_PER_PAGE) {
          pages.push({
            rows: [...currentPageRows],
            zoneSummary: currentZoneSummary,
            pageNumber: pages.length + 1,
          });
          currentPageRows = [];
          // ❌ CONTINUATION ROW REMOVED - nothing added here
        }

        addBookRow(book, zone.zone);
      });

      // Add zone total row at the bottom
      addZoneTotalRow(zone);

      // Add spacing between zones
      if (zoneIndex < reportData.zones.length - 1) {
        currentPageRows.push({
          type: "spacer",
          height: 10,
        });
      }
    });

    // Add grand total row
    if (currentPageRows.length >= MAX_ROWS_PER_PAGE) {
      startNewPage();
    }

    currentPageRows.push({
      type: "grandTotal",
      book: "",
      count: reportData.summary.totalCount,
      usage: reportData.summary.totalUsage.toFixed(2),
      billAmount: reportData.summary.totalBillAmount.toFixed(2),
      seniorAmount: reportData.summary.totalSeniorAmount.toFixed(2),
      isBold: false,
      backgroundColor: "#ffffff",
      borderTop: true,
      borderBottom: false,
    });

    if (currentPageRows.length > 0) {
      pages.push({
        rows: [...currentPageRows],
        zoneSummary: currentZoneSummary,
        pageNumber: pages.length + 1,
      });
    }

    return pages;
  };

  const reportStructure = generateMonthlyReportWithDetails(data);
  const pages = createPages(reportStructure);

  return (
    <Document>
      {pages.map((page, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page} orientation="landscape">
          <PdfBillingSummaryHeader
            isoCode="CSD-014-1"
            page={{ current: page.pageNumber, total: pages.length }}
            dateTime={new Date()}
            dateRange={{ from: new Date("February 1, 2026"), to: new Date("February 25, 2026") }}
          />

          {/* Table */}
          <View style={styles.table}>
            <BillAmountTableHeader />

            {page.rows.map((row, rowIndex) => {
              if (row.type === "spacer") {
                return <View key={rowIndex} style={[styles.tableRow, { height: row.height }]} />;
              }

              return (
                <View
                  key={rowIndex}
                  style={[
                    styles.tableRow,
                    styles.w100,
                    {
                      backgroundColor: row.backgroundColor || "transparent",
                      borderTopWidth: row.borderTop ? 1 : 0,
                      borderBottomWidth: row.borderBottom ? 1 : 0,
                      borderBottomStyle: row.borderBottomStyle || "dotted", // ✅ Add border style
                    },
                  ]}
                >
                  <View style={[styles.tableCol, styles.w12_5, { borderLeft: 0, padding: 0 }]}>
                    {row.type === "grandTotal" ? (
                      <Text style={[styles.cellText, { fontWeight: row.isBold ? "bold" : "normal" }]}>
                        {row.book}
                      </Text>
                    ) : (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          gap: 30,
                          alignItems: "flex-start",
                          width: "100%",
                          paddingLeft: 5,
                          paddingVertical: 5,
                        }}
                      >
                        <Text style={[styles.cellText, { fontWeight: row.isBold ? "bold" : "normal" }]}>
                          {row.type === "zoneTotal"
                            ? row.zone
                            : row.type === "continuation"
                              ? `ZONE ${row.zone}`
                              : row.zone}
                        </Text>
                        <Text style={[styles.cellText, { fontWeight: row.isBold ? "bold" : "normal" }]}>
                          {row.type === "zoneTotal"
                            ? "Total"
                            : row.type === "continuation"
                              ? "(continued)"
                              : row.book.toString().padStart(2, "0")}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Count Column - Bold for zoneTotal */}
                  <View style={[styles.tableCol, styles.w17_5]}>
                    <Text
                      style={[
                        styles.cellText,
                        {
                          fontWeight:
                            row.type === "zoneTotal" || row.type === "grandTotal" ? "bold" : "normal",
                        },
                      ]}
                    >
                      {row.count}
                    </Text>
                  </View>

                  {/* Usage Column - Bold for zoneTotal */}
                  <View style={[styles.tableCol, styles.w25]}>
                    <Text
                      style={[
                        styles.cellText,
                        {
                          fontWeight:
                            row.type === "zoneTotal" || row.type === "grandTotal" ? "bold" : "normal",
                        },
                      ]}
                    >
                      {row.usage}
                    </Text>
                  </View>

                  {/* Bill Amount Column - Bold for zoneTotal */}
                  <View style={[styles.tableCol, styles.w22_5]}>
                    <Text
                      style={[
                        styles.cellText,
                        {
                          fontWeight:
                            row.type === "zoneTotal" || row.type === "grandTotal" ? "bold" : "normal",
                        },
                      ]}
                    >
                      {typeof row.billAmount === "number"
                        ? row.billAmount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : row.billAmount}
                    </Text>
                  </View>

                  {/* Senior Amount Column - Keep normal weight */}
                  <View style={[styles.tableCol, styles.w22_5, { borderRight: 0 }]}>
                    <Text style={[styles.cellText, { fontWeight: "bold" }]}>
                      {typeof row.seniorAmount === "number"
                        ? row.seniorAmount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : row.seniorAmount}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Page>
      ))}
    </Document>
  );
};

export const MonthlyBillingSummaryPdf: FunctionComponent<MonthlyBillingSummaryPdfProps> = ({ yearMonth }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const formatDate = (yearMonth: string) => {
    const newDate = parse(yearMonth, "yyyy-MM", new Date());
    return format(newDate, "MMMM yyyy");
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["schedule", yearMonth],
    queryFn: async () => {
      // const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/schedules?date=${yearMonth}`);
      // const res = await axios.get(`https://api.jsonsilo.com/public/574263b5-fbb5-47fe-81ce-d9f26c64223d`);
      // https://api.jsonsilo.com/public/574263b5-fbb5-47fe-81ce-d9f26c64223d

      const res = await axios.get(`https://api.npoint.io/70dcbd15a19e2b3b0574`);
      console.log(res.data);
      return res.data;
    },
    enabled: !!yearMonth,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const generatePdfPreview = async () => {
    if (!data || data.length === 0) return;

    setIsGeneratingPdf(true);
    try {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      // ✅ Pass the raw data directly - the PDF component will transform it
      const blob = await pdf(<MonthlyBillingSummaryPDF data={data} yearMonth={yearMonth} />).toBlob();

      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error generating PDF preview:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Generate PDF when data is loaded
  useEffect(() => {
    if (data && data.length > 0) {
      generatePdfPreview();
    }
  }, [data, yearMonth]);

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
        <Spinner />
        <span className="ml-2">Loading Summary of Bills...</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col p-8">
      {/* PDF Preview Section */}
      <div className="mb-6">
        <div className="h-[44rem] rounded-lg bg-white shadow-lg">
          <div className="h-full bg-gray-50">
            {isGeneratingPdf ? (
              <div className="flex h-[44rem] items-center justify-center">
                <div className="text-center">
                  <Spinner className="mx-auto mb-2 h-8 w-8" />
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
