"use client";

import { Spinner } from "@mr/components/ui/Spinner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FunctionComponent, JSX, useEffect, useState } from "react";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { format, parse } from "date-fns";
import { PdfReportHeader } from "../PdfReportHeader";

type SummaryOfBillsPdfProps = {
  yearMonth: string;
};

// Updated type definition for new data structure
type RawBookRecord = {
  zone: string;
  book: string;
  count: number;
  totalConsumption: number;
  totalBilledAmount: number;
  totalSeniorDiscount: number;
};

type InputDataType = RawBookRecord[];

// Types for the processed data structure
type BookRecord = {
  book: string;
  count: number;
  usage: number;
  billAmount: number;
  seniorAmount: number;
};

type ZoneSummary = {
  totalCount: number;
  totalUsage: number;
  totalBillAmount: number;
  totalSeniorAmount: number;
  bookCount: number;
};

type ZoneData = {
  zone: string;
  books: BookRecord[];
  zoneSummary: ZoneSummary;
};

type ReportStructure = {
  reportMetadata: {
    generatedAt: string;
    reportMonth: string;
    reportPeriod: string;
    totalZones: number;
    totalBooks: number;
  };
  summary: {
    totalCount: number;
    totalUsage: number;
    totalBillAmount: number;
    totalSeniorAmount: number;
  };
  zones: ZoneData[];
  analytics: {
    averagePerZone: {
      count: number;
      usage: number;
      billAmount: number;
      seniorAmount: number;
    };
    averagePerBook: {
      usage: number;
      billAmount: number;
      seniorAmount: number;
    };
  };
};

type PageRow = {
  type: "book" | "zoneTotal" | "spacer" | "grandTotal" | "continuation";
  zone?: string;
  book?: string;
  count?: number;
  usage?: number;
  billAmount?: number;
  seniorAmount?: number;
  isBold?: boolean;
  backgroundColor?: string;
  borderTop?: boolean;
  borderBottom?: boolean;
  borderBottomStyle?: string;
  height?: number;
};

type PageData = {
  rows: PageRow[];
  zoneSummary?: ZoneSummary;
  pageNumber: number;
  hasSignatory: boolean;
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
  w22: { width: "22%" },
  w20: { width: "20%" },
  w17_5: { width: "17.5%" },
  w18: { width: "18%" },
  w15: { width: "15%" },
  w12_5: { width: "12.5%" },
  w10: { width: "10%" },
  w7_5: { width: "7.5%" },
  w6: { width: "6%" },
  w5: { width: "5%" },
});

interface SummaryOfBillsPDFProps {
  data: InputDataType;
  yearMonth: string;
}

const SummaryOfBillsPDF: FunctionComponent<SummaryOfBillsPDFProps> = ({ data, yearMonth }): JSX.Element => {
  const formatDate = (yearMonth: string) => {
    const newDate = parse(yearMonth, "yyyy-MM", new Date());
    return format(newDate, "MMMM yyyy");
  };

  const HorizontalLine = () => (
    <View
      style={{
        width: "100%",
        height: 1,
        backgroundColor: "#000",
        paddingHorizontal: 2,
        marginTop: 2,
      }}
    />
  );

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

  // Signatories
  const SignatorySection = () => (
    <View
      style={{
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 20,
      }}
    >
      <View style={{ width: "50%" }}>
        <Text style={{ fontSize: 9, marginBottom: 5 }}>Prepared by:</Text>
        <View style={{ marginTop: 15, flexDirection: "column", justifyContent: "center", width: "100%" }}>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            MARK JOSEPH D. DANO
          </Text>
          <HorizontalLine />
          <Text style={{ fontSize: 8, marginTop: 2, color: "#252525", textAlign: "center" }}>
            CUSTOMER SERVICE ASSISTANT B
          </Text>
        </View>
      </View>

      <View style={{ width: "50%" }}>
        <Text style={{ fontSize: 9, marginBottom: 5 }}>Noted by:</Text>
        <View style={{ marginTop: 15, flexDirection: "column", justifyContent: "center", width: "100%" }}>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            SAMCELLE B. VALENZUELA
          </Text>
          <HorizontalLine />
          <Text style={{ fontSize: 7, marginTop: 2, color: "#252525", textAlign: "center" }}>
            DIVISION MANAGER A - BILLING AND ACCOUNTS DIVISION
          </Text>
        </View>
      </View>
    </View>
  );

  const generateMonthlyReportWithDetails = (
    data: InputDataType,
    reportDate = new Date(),
  ): ReportStructure => {
    // Filter out the grandTotal from zones
    const zonesData = data.filter((item) => item.zone !== "grandTotal");
    const grandTotalData = data.find((item) => item.zone === "grandTotal");

    // Group by zone
    const zoneMap = new Map<string, ZoneData>();

    zonesData.forEach((record) => {
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

      const zoneData = zoneMap.get(zone)!;

      // Skip adding the "total" book entry as a regular row
      if (record.book !== "total") {
        zoneData.books.push({
          book: record.book,
          count: record.count,
          usage: record.totalConsumption,
          billAmount: record.totalBilledAmount,
          seniorAmount: record.totalSeniorDiscount,
        });
      }

      // Update zone summary (include total book entries)
      zoneData.zoneSummary.totalCount += record.count;
      zoneData.zoneSummary.totalUsage += record.totalConsumption;
      zoneData.zoneSummary.totalBillAmount += record.totalBilledAmount;
      zoneData.zoneSummary.totalSeniorAmount += record.totalSeniorDiscount;
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

    // Convert map to array and round values
    const zones: ZoneData[] = Array.from(zoneMap.values()).map((zone) => {
      zone.zoneSummary = {
        ...zone.zoneSummary,
        totalUsage: Math.round(zone.zoneSummary.totalUsage * 100) / 100,
        totalBillAmount: Math.round(zone.zoneSummary.totalBillAmount * 100) / 100,
        totalSeniorAmount: Math.round(zone.zoneSummary.totalSeniorAmount * 100) / 100,
      };

      grandTotals.totalCount += zone.zoneSummary.totalCount;
      grandTotals.totalUsage += zone.zoneSummary.totalUsage;
      grandTotals.totalBillAmount += zone.zoneSummary.totalBillAmount;
      grandTotals.totalSeniorAmount += zone.zoneSummary.totalSeniorAmount;
      grandTotals.totalBooks += zone.books.length;

      return zone;
    });

    // Sort zones by zone number
    zones.sort((a, b) => parseInt(a.zone) - parseInt(b.zone));

    // Round grand totals
    grandTotals = {
      totalCount: grandTotals.totalCount,
      totalUsage: Math.round(grandTotals.totalUsage * 100) / 100,
      totalBillAmount: Math.round(grandTotals.totalBillAmount * 100) / 100,
      totalSeniorAmount: Math.round(grandTotals.totalSeniorAmount * 100) / 100,
      totalBooks: grandTotals.totalBooks,
    };

    // If grandTotalData exists, use it to override
    if (grandTotalData) {
      grandTotals = {
        totalCount: grandTotalData.count,
        totalUsage: grandTotalData.totalConsumption,
        totalBillAmount: grandTotalData.totalBilledAmount,
        totalSeniorAmount: grandTotalData.totalSeniorDiscount,
        totalBooks: grandTotals.totalBooks,
      };
    }

    // Sort books by book number
    zones.forEach((zone) => {
      zone.books.sort((a, b) => parseInt(a.book) - parseInt(b.book));
    });

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

  // create pages with rows
  const createPages = (reportData: ReportStructure): PageData[] => {
    const pages: PageData[] = [];

    let currentPageRows: PageRow[] = [];
    let currentZoneSummary: ZoneSummary | undefined;
    let currentZone: string | null = null;
    let currentZoneData: ZoneData | null = null;

    const MAX_ROWS_PER_PAGE = 30;
    const ROWS_RESERVED_FOR_SIGNATORY = 5;

    const addZoneTotalRow = (zone: ZoneData) => {
      currentPageRows.push({
        type: "zoneTotal",
        zone: zone.zone,
        book: `${zone.zone} - Total`,
        count: zone.zoneSummary.totalCount,
        usage: zone.zoneSummary.totalUsage,
        billAmount: zone.zoneSummary.totalBillAmount,
        seniorAmount: zone.zoneSummary.totalSeniorAmount,
        isBold: false,
        backgroundColor: "#ffffff",
        borderTop: false,
        borderBottom: true,
        borderBottomStyle: "dotted",
      });
    };

    const addBookRow = (book: BookRecord, zone: string) => {
      currentPageRows.push({
        type: "book",
        zone: zone,
        book: book.book,
        count: book.count,
        usage: book.usage,
        billAmount: book.billAmount,
        seniorAmount: book.seniorAmount,
        isBold: false,
      });
    };

    const needsNewPage = (isLastZone: boolean, isLastBook: boolean) => {
      const baseMax =
        isLastZone && isLastBook ? MAX_ROWS_PER_PAGE - ROWS_RESERVED_FOR_SIGNATORY : MAX_ROWS_PER_PAGE;
      return currentPageRows.length >= baseMax;
    };

    const startNewPage = (zone?: ZoneData, isLastPage = false) => {
      if (currentPageRows.length > 0) {
        pages.push({
          rows: [...currentPageRows],
          zoneSummary: currentZoneSummary,
          pageNumber: pages.length + 1,
          hasSignatory: isLastPage,
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
    reportData.zones.forEach((zone, zoneIndex) => {
      const isLastZone = zoneIndex === reportData.zones.length - 1;

      if (currentZone !== zone.zone) {
        if (currentPageRows.length >= MAX_ROWS_PER_PAGE - 2) {
          startNewPage();
        }
        currentZone = zone.zone;
        currentZoneSummary = zone.zoneSummary;
        currentZoneData = zone;
      }

      // Add all books for this zone
      zone.books.forEach((book, bookIndex) => {
        const isLastBook = isLastZone && bookIndex === zone.books.length - 1;

        if (needsNewPage(isLastZone, isLastBook)) {
          const wouldBeLastPage =
            isLastZone && isLastBook && pages.length === 0 && currentPageRows.length === 0;

          startNewPage(zone, wouldBeLastPage);
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
    if (currentPageRows.length >= MAX_ROWS_PER_PAGE - ROWS_RESERVED_FOR_SIGNATORY) {
      startNewPage(undefined, true);
    }

    currentPageRows.push({
      type: "grandTotal",
      book: "",
      count: reportData.summary.totalCount,
      usage: reportData.summary.totalUsage,
      billAmount: reportData.summary.totalBillAmount,
      seniorAmount: reportData.summary.totalSeniorAmount,
      isBold: false,
      backgroundColor: "#ffffff",
      borderTop: true,
      borderBottom: false,
    });

    // Push the final page with signatory flag
    if (currentPageRows.length > 0) {
      pages.push({
        rows: [...currentPageRows],
        zoneSummary: currentZoneSummary,
        pageNumber: pages.length + 1,
        hasSignatory: true,
      });
    }

    return pages;
  };

  const reportStructure = generateMonthlyReportWithDetails(data);
  const pages = createPages(reportStructure);

  return (
    <Document>
      {pages.map((page, pageIndex) => (
        <Page key={pageIndex} size="LETTER" style={styles.page} orientation="portrait">
          <PdfReportHeader
            isoCode="CSD-014-1"
            page={{ current: page.pageNumber, total: pages.length }}
            dateTime={new Date()}
          />
          <View style={styles.header}>
            <Text style={[{ fontWeight: "bold", fontSize: "12" }]}>SUMMARY OF BILLS</Text>
            <Text style={styles.title}>As of {formatDate(yearMonth)}</Text>
          </View>

          {/* Table */}
          <View style={styles.table}>
            <TableHeader />

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
                      borderBottomStyle: "dotted",
                      //row.borderBottomStyle ||
                    },
                  ]}
                >
                  <View style={[styles.tableCol, styles.w12_5, { borderLeft: 0, padding: 0 }]}>
                    {row.type === "grandTotal" ? (
                      <Text style={[styles.cellText, { fontWeight: row.isBold ? "bold" : "normal" }]}>
                        GRAND TOTAL
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
                              : row.book?.toString().padStart(2, "0")}
                        </Text>
                      </View>
                    )}
                  </View>

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
                      {row.count?.toLocaleString("en-US")}
                    </Text>
                  </View>

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
                      {row.usage?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                  </View>

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
                      {row.billAmount?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                  </View>

                  <View style={[styles.tableCol, styles.w22_5, { borderRight: 0 }]}>
                    <Text style={[styles.cellText, { fontWeight: "bold" }]}>
                      {row.seniorAmount?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          {page.hasSignatory && (
            <View style={{ marginTop: 20 }}>
              <SignatorySection />
            </View>
          )}
        </Page>
      ))}
    </Document>
  );
};

export const SummaryOfBillsPdf: FunctionComponent<SummaryOfBillsPdfProps> = ({ yearMonth }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const formatDate = (yearMonth: string) => {
    const newDate = parse(yearMonth, "yyyy-MM", new Date());
    return format(newDate, "MMMM yyyy");
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["summary-of-bills", yearMonth],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_MR_BE}/summary/zone-book?readingMonth=${yearMonth}`,
      );

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

      const blob = await pdf(<SummaryOfBillsPDF data={data} yearMonth={yearMonth} />).toBlob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error generating PDF preview:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  useEffect(() => {
    if (data && data.length > 0) {
      generatePdfPreview();
    }
  }, [data, yearMonth]);

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
