"use client";

import { Spinner } from "@mr/components/ui/Spinner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FunctionComponent, JSX, useEffect, useState } from "react";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { format, parse } from "date-fns";
import { PdfBillingSummaryHeader } from "../PdfBillingSummaryHeader";

type MonthlyBillingSummaryPdfProps = {
  yearMonth: string;
};

type BillingSizeType = {
  column: string;
};

type NoOfBillsType = {
  classification: Array<{
    name: string;
    sizes: Array<
      BillingSizeType & {
        count: number;
      }
    >;
    total: number; // Each classification has its own total
  }>;
  fittings: Array<BillingSizeType & { total: number }>;
  grandTotal: number;
};

type ConsumptionType = {
  classification: Array<{
    name: string;
    sizes: Array<
      BillingSizeType & {
        consumption: number;
      }
    >;
    total: number; // Each classification has its own total
  }>;
  fittings: Array<BillingSizeType & { total: number }>;
  grandTotal: number;
};

type BillAmountType = {
  classification: Array<{
    name: string;
    sizes: Array<
      BillingSizeType & {
        amount: number;
      }
    >;
    total: number; // Each classification has its own total
  }>;
  fittings: Array<BillingSizeType & { total: number }>;
  grandTotal: number;
};

type RawBillingSummary = {
  noOfBills: NoOfBillsType;
  billAmount: BillAmountType;
  consumption: ConsumptionType;
};

type InputDataType = RawBillingSummary;

// Fixed pipe sizes in order
const PIPE_SIZES = ["3/8", "1/2", "3/4", "1", "1 1/2", "2", "2 1/2", "3", "4"];

// Fixed classifications in order
const CLASSIFICATIONS = [
  "COMMERCIAL",
  "COMMERCIAL - A",
  "COMMERCIAL - B",
  "COMMERCIAL - C",
  "GOVERNMENT",
  "RESIDENTIAL",
  "SPECIAL",
];

// Updated styles with corrected widths that total 100%
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    paddingVertical: 5,
    paddingHorizontal: 20,
    fontSize: 8,
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
  tableContainer: {
    marginBottom: 10,
  },
  tableTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 3,
    paddingLeft: 4,
    backgroundColor: "#ffffff",
    padding: 2,
  },
  table: {
    width: "100%", // Ensure table takes full width
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    width: "100%", // Ensure row takes full width
    minHeight: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#000",
  },
  tableRowEven: {
    backgroundColor: "#f9f9f9",
  },
  tableRowOdd: {
    backgroundColor: "#ffffff",
  },
  tableRowTotal: {
    backgroundColor: "#e8e8e8",
    borderTopWidth: 0.5,
    borderTopColor: "#000",
    fontWeight: "bold",
  },
  tableHeaderRow: {
    flexDirection: "row",
    width: "100%", // Ensure header takes full width
    backgroundColor: "#d3d3d3",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    fontWeight: "bold",
  },
  tableCol: {
    padding: 2,
    justifyContent: "center",
    borderRightWidth: 0.5,
    borderRightColor: "#000",
  },
  tableColLast: {
    padding: 2,
    justifyContent: "center",
    // No border right for last column
  },
  // Maximized classification column - 18% width
  classificationCell: {
    width: "18%",
    padding: 2,
    paddingLeft: 6,
    borderRightWidth: 0.5,
    borderRightColor: "#000",
  },
  // Size columns - 8...% each to total 72% (18% + 72% + 10% = 100%)
  sizeCell: {
    width: "8%", // 72% ÷ 9 = 8...%
    textAlign: "right",
    paddingRight: 0,
  },
  // Total column - 10% on the far right
  totalCell: {
    width: "10%",
    textAlign: "right",
    paddingRight: 4,
    fontWeight: "bold",
    // backgroundColor: "#f0f0f0",
  },
  headerText: {
    fontSize: 8,
    // fontWeight: "bold",
    textAlign: "center",
    paddingLeft: 4,
  },
  cellText: {
    fontSize: 8,
    textAlign: "right",
  },
  classificationText: {
    fontSize: 8,
    textAlign: "left",
    // fontWeight: "bold",
  },
  footer: {
    marginTop: 5,
    fontSize: 6,
    textAlign: "right",
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
  w9: { width: "9%" },
  w8: { width: "8%" },
  w7_56: { width: "7.56%" },
  w7_5: { width: "7.5%" },
  w7: { width: "7%" },
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

  // Helper function to get value from sizes array for a specific column
  const getValueForColumn = (
    classification:
      | {
          name: string;
          sizes: Array<BillingSizeType & { count?: number; amount?: number; consumption?: number }>;
          total: number;
        }
      | undefined,
    column: string,
    metricType: "count" | "amount" | "consumption",
  ): number => {
    if (!classification) return 0;
    const sizeItem = classification.sizes.find((s) => s.column === column);
    if (!sizeItem) return 0;

    if (metricType === "count" && sizeItem.count !== undefined) return sizeItem.count;
    if (metricType === "amount" && sizeItem.amount !== undefined) return sizeItem.amount;
    if (metricType === "consumption" && sizeItem.consumption !== undefined) return sizeItem.consumption;
    return 0;
  };

  // Helper function to format number
  const formatNumber = (num: number, min?: number, max?: number): string => {
    if (num === 0) return "0";
    return num.toLocaleString("en-US", {
      // minimumFractionDigits: num % 1 === 0 ? 0 : 2,
      minimumFractionDigits: min !== undefined ? min : 2,
      maximumFractionDigits: max !== undefined ? max : 2,
    });
  };

  // Create lookup maps for faster access
  const createLookupMap = (data: {
    classification: Array<{
      name: string;
      sizes: Array<BillingSizeType & { count?: number; amount?: number; consumption?: number }>;
      total: number;
    }>;
  }) => {
    const map = new Map();
    if (data?.classification) {
      data.classification.forEach((item) => {
        map.set(item.name, item);
      });
    }
    return map;
  };

  const billAmountMap = createLookupMap(data.billAmount);
  const noOfBillsMap = createLookupMap(data.noOfBills);
  const consumptionMap = createLookupMap(data.consumption);

  // Table Header Component
  const TableHeader = () => (
    <View style={styles.tableHeaderRow}>
      <View style={[styles.classificationCell]}>
        <Text style={[styles.headerText, { textAlign: "left", paddingLeft: 0 }]}>CLASSIFICATION</Text>
      </View>
      {PIPE_SIZES.map((size, index) => (
        <View key={index} style={[styles.sizeCell, styles.tableCol]}>
          <Text style={[styles.headerText, { letterSpacing: 1.5 }]}>{size}</Text>
        </View>
      ))}
      <View style={[styles.totalCell, styles.tableColLast]}>
        <Text style={[styles.headerText, { textAlign: "right" }]}>TOTAL</Text>
      </View>
    </View>
  );

  // Table Row Component for a specific metric type - USING THE PROVIDED TOTAL
  const TableRows = (
    metricType: "count" | "amount" | "consumption",
    dataMap: Map<
      string,
      {
        name: string;
        sizes: Array<BillingSizeType & { count?: number; amount?: number; consumption?: number }>;
        total: number;
      }
    >,
  ) => {
    return CLASSIFICATIONS.map((classification, rowIndex) => {
      const classificationData = dataMap.get(classification);
      const total = classificationData?.total || 0; // Use the provided total from the data
      const isEven = rowIndex % 2 === 0;

      return (
        <View key={rowIndex} style={[styles.tableRow, isEven ? styles.tableRowEven : styles.tableRowOdd]}>
          <View style={[styles.classificationCell]}>
            <Text style={styles.classificationText}>{classification}</Text>
          </View>
          {PIPE_SIZES.map((size, colIndex) => {
            const value = getValueForColumn(classificationData, size, metricType);
            return (
              <View key={colIndex} style={[styles.sizeCell, styles.tableCol]}>
                <Text style={styles.cellText}>
                  {metricType == "count" ? formatNumber(value, 0, 0) : formatNumber(value)}
                </Text>
              </View>
            );
          })}
          <View style={[styles.totalCell, styles.tableColLast]}>
            <Text style={[styles.cellText, { fontWeight: "bold" }]}>
              {metricType == "count" ? formatNumber(total, 0, 0) : formatNumber(total)}
            </Text>
          </View>
        </View>
      );
    });
  };

  // Grand Total Row Component - USING THE PROVIDED GRAND TOTAL
  const GrandTotalRow = (
    metricType: "count" | "amount" | "consumption",
    dataMap: Map<
      string,
      {
        name: string;
        sizes: Array<BillingSizeType & { count?: number; amount?: number; consumption?: number }>;
        total: number;
      }
    >,
    grandTotalValue: number, // Pass the grand total from the data
  ) => {
    // Calculate column totals (still need these since they're not provided)
    const columnTotals = PIPE_SIZES.map((size) => {
      return CLASSIFICATIONS.reduce((sum, classification) => {
        const classificationData = dataMap.get(classification);
        return sum + getValueForColumn(classificationData, size, metricType);
      }, 0);
    });

    return (
      <View style={[styles.tableRow, styles.tableRowTotal]}>
        <View style={[styles.classificationCell]}>
          <Text style={[styles.classificationText, { textAlign: "left" }]}>GRAND TOTAL</Text>
        </View>
        {columnTotals.map((total, index) => (
          <View key={index} style={[styles.sizeCell, styles.tableCol]}>
            <Text style={[styles.cellText, { fontWeight: "bold" }]}>
              {metricType == "count" ? formatNumber(total, 0, 0) : formatNumber(total)}
            </Text>
          </View>
        ))}
        <View style={[styles.totalCell, styles.tableColLast]}>
          <Text style={[styles.cellText, { fontWeight: "bold" }]}>
            {metricType == "count" ? formatNumber(grandTotalValue, 0, 0) : formatNumber(grandTotalValue)}
          </Text>
        </View>
      </View>
    );
  };

  // Complete Table Component
  const renderTable = (
    title: string,
    metricType: "count" | "amount" | "consumption",
    dataMap: Map<
      string,
      {
        name: string;
        sizes: Array<BillingSizeType & { count?: number; amount?: number; consumption?: number }>;
        total: number;
      }
    >,
    grandTotal: number,
  ) => {
    return (
      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>{title}</Text>
        <View style={styles.table}>
          <TableHeader />
          {TableRows(metricType, dataMap)}
          {GrandTotalRow(metricType, dataMap, grandTotal)}
        </View>
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <PdfBillingSummaryHeader
          isoCode="CSD-014-1"
          page={{ current: 1, total: 1 }}
          dateTime={new Date()}
          dateRange={{ from: new Date(yearMonth + "-01"), to: new Date() }}
        />

        {/* Bill Amount Table - using grandTotal from data */}
        {renderTable("BILL AMOUNT", "amount", billAmountMap, data.billAmount?.grandTotal || 0)}

        {/* No. of Bills Table - using grandTotal from data */}
        {renderTable("NO. OF BILLS", "count", noOfBillsMap, data.noOfBills?.grandTotal || 0)}

        {/* Consumption Table - using grandTotal from data */}
        {renderTable("CONSUMPTION", "consumption", consumptionMap, data.consumption?.grandTotal || 0)}

        {/* <Text style={styles.footer}>
          Generated on: {format(new Date(), "MMMM dd, yyyy hh:mm a")} for {formatDate(yearMonth)}
        </Text> */}
      </Page>
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
    queryKey: ["billing-summary", yearMonth],
    queryFn: async () => {
      const res = await axios.get(`https://api.npoint.io/70dcbd15a19e2b3b0574`);
      console.log(res.data);
      return res.data;
    },
    enabled: !!yearMonth,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const generatePdfPreview = async () => {
    if (!data) return;

    setIsGeneratingPdf(true);
    try {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

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
    if (data) {
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
        <span className="ml-2">Loading Billing Summary...</span>
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
