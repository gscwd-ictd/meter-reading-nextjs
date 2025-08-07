"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";

type MeterReaderWithZonebooks = {
  name: string;
};

export type BilledMeterReadingSchedule = {
  id?: string;
  readingDate: string;
  dueDate: string | string[] | undefined;
  disconnectionDate: string | string[] | undefined;
  billed: number;
  remarks: string;
  meterReaders?: MeterReaderWithZonebooks[];
  zoneBook: string;
  area: string;
};

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    textAlign: "center",
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderColor: "#000",
    paddingVertical: 3,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    paddingVertical: 6, // increase from default
    minHeight: 18, // ensures consistent height
  },
  colHeader: {
    fontWeight: "bold",
    fontSize: 9,
    textAlign: "center",
  },
  col: {
    fontSize: 9,
    textAlign: "center",
    paddingHorizontal: 2,
  },
  colWidths: {
    day: 30,
    date: 30,
    due: 30,
    disc: 40,
    reader: 90,
    zoneBook: 70,
    area: 120,
    billed: 50,
    remarks: 70,
  },
});

interface MeterReadingPDFProps {
  date: string;
}

const fetchSchedules = async (date: string): Promise<BilledMeterReadingSchedule[]> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/schedules?date=${date}`);
  return res.data;
};

const groupByDate = (data: BilledMeterReadingSchedule[]) => {
  return data.reduce((acc: Record<string, BilledMeterReadingSchedule[]>, item) => {
    if (!acc[item.readingDate]) acc[item.readingDate] = [];
    acc[item.readingDate].push(item);
    return acc;
  }, {});
};

const formatReaderName = (name: string): string => {
  if (!name) return "";
  const parts = name.split(",");
  if (parts.length < 2) return name.toUpperCase();
  const lastName = parts[0].trim().toUpperCase();
  const firstName = parts[1].trim().split(" ")[0];
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
  return `${lastName}, ${firstInitial}.`;
};

const formatDate = (d?: string | string[]) => {
  if (!d) return "";
  if (Array.isArray(d)) {
    return d.map((date) => format(new Date(date), "M/d")).join(", ");
  }
  return format(new Date(d), "M/d");
};

export default function MeterReadingSchedulePdf({ date }: MeterReadingPDFProps) {
  const { data, isLoading, error } = useQuery<BilledMeterReadingSchedule[]>({
    queryKey: ["billedSchedules", date],
    queryFn: () => fetchSchedules(date),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  const formattedMonth = format(new Date(`${date}-01`), "MMMM, yyyy");
  const grouped = groupByDate(data || []);

  const uniqueDates = Object.keys(grouped).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const dayMap: Record<string, number> = {};
  let dayCounter = 0;

  uniqueDates.forEach((d, i) => {
    const currentDate = new Date(d);
    const prevDate = i > 0 ? new Date(uniqueDates[i - 1]) : null;
    const dayOfWeek = currentDate.getDay();

    if (dayOfWeek === 0 && prevDate && prevDate.getDay() === 6) {
      dayMap[d] = dayMap[uniqueDates[i - 1]];
    } else {
      dayCounter++;
      dayMap[d] = dayCounter;
    }
  });

  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text>GENERAL SANTOS CITY WATER DISTRICT</Text>
            <Text>METER READING SCHEDULE</Text>
            <Text>{formattedMonth}</Text>
          </View>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.colHeader, { width: styles.colWidths.day }]}>DAY</Text>
            <Text style={[styles.colHeader, { width: styles.colWidths.date }]}>DATE</Text>
            <Text style={[styles.colHeader, { width: styles.colWidths.due }]}>DUE</Text>
            <Text style={[styles.colHeader, { width: styles.colWidths.disc }]}>DISC</Text>
            <Text style={[{ ...styles.colHeader, textAlign: "left" }, { width: styles.colWidths.reader }]}>
              METER READER
            </Text>
            <Text style={[styles.colHeader, { width: styles.colWidths.zoneBook }]}>ZONE/BOOK</Text>
            <Text style={[styles.colHeader, { width: styles.colWidths.area }]}>AREA</Text>
            <Text style={[styles.colHeader, { width: styles.colWidths.billed }]}>BILLED</Text>
            <Text style={[styles.colHeader, { width: styles.colWidths.remarks }]}>REMARKS</Text>
          </View>

          {Object.entries(grouped).map(([groupDate, schedules], idx) => {
            // const totalRows = schedules.reduce((sum, s) => sum + (s.meterReaders?.length || 1), 0);
            let renderedRows = 0;

            return schedules.flatMap((item, index) => {
              const readers = item.meterReaders && item.meterReaders.length > 0 ? item.meterReaders : [null];

              return readers.map((reader, rIndex) => {
                renderedRows++;
                const showMergedCells = renderedRows === 1;

                return (
                  <View key={`${idx}-${index}-${rIndex}`} style={styles.tableRow}>
                    {/* Day */}
                    <Text style={[styles.col, { width: styles.colWidths.day }]}>
                      {showMergedCells ? dayMap[groupDate] : ""}
                    </Text>

                    {/* Reading Date */}
                    <Text style={[styles.col, { width: styles.colWidths.date }]}>
                      {showMergedCells ? format(new Date(groupDate), "M/d") : ""}
                    </Text>

                    {/* Due */}
                    <Text style={[styles.col, { width: styles.colWidths.due }]}>
                      {showMergedCells ? formatDate(item.dueDate) : ""}
                    </Text>

                    {/* Disc */}
                    <Text style={[styles.col, { width: styles.colWidths.disc }]}>
                      {showMergedCells ? formatDate(item.disconnectionDate) : ""}
                    </Text>

                    {/* Reader */}
                    <Text style={[{ ...styles.col, textAlign: "left" }, { width: styles.colWidths.reader }]}>
                      {reader ? formatReaderName(reader.name) : ""}
                    </Text>

                    {/* Zone/Book */}
                    <Text style={[styles.col, { width: styles.colWidths.zoneBook }]}>{item.zoneBook}</Text>

                    {/* Area */}
                    <Text style={[styles.col, { width: styles.colWidths.area }]}>{item.area}</Text>

                    {/* Billed */}
                    <Text style={[styles.col, { width: styles.colWidths.billed }]}>{item.billed}</Text>

                    {/* Remarks */}
                    <Text style={[styles.col, { width: styles.colWidths.remarks }]}>{item.remarks}</Text>
                  </View>
                );
              });
            });
          })}
        </Page>
      </Document>
    </PDFViewer>
  );
}
