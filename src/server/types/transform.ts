const METER_SIZES = ["3/8", "1/2", "3/4", "1", "1 1/2", "2", "2 1/2", "3", "4"] as const;

export type MeterSize = (typeof METER_SIZES)[number];

export type RawRow = {
  classification: string;
  "3/8": number;
  "1/2": number;
  "3/4": number;
  "1": number;
  "1 1/2": number;
  "2": number;
  "2 1/2": number;
  "3": number;
  "4": number;
  total: number;
};

const toName = (classification: string) => (classification === "grand total" ? "grandTotal" : classification);

export function transformBillAmount(rows: RawRow[]) {
  return rows.map((row) => ({
    name: toName(row.classification),
    sizes: METER_SIZES.map((size) => ({
      column: size,
      amount: row[size],
    })),
    total: row.total,
  }));
}

export function transformNoOfBills(rows: RawRow[]) {
  return rows.map((row) => ({
    name: toName(row.classification),
    sizes: METER_SIZES.map((size) => ({
      column: size,
      count: row[size],
    })),
    total: row.total,
  }));
}

export function transformConsumption(rows: RawRow[]) {
  return rows.map((row) => ({
    name: toName(row.classification),
    sizes: METER_SIZES.map((size) => ({
      column: size,
      consumption: row[size],
    })),
    total: row.total,
  }));
}
