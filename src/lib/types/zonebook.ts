import { AccountDetails } from "./accounts";

export type Zonebook = {
  zoneBook: string;
  zone: string;
  book: string;
  area: Area;
  id?: string | undefined;
  day: number | null;
};

export type ZonebookReassignment = Zonebook & {
  meterReader: { name: string; id: string };
};

export type ZonebookWithDates = Zonebook & {
  dueDate: Date | undefined;
  disconnectionDate: Date | undefined;
};

export type Area = {
  id: string;
  name: string;
};

export type Reassignment = {
  zoneBooks: ZonebookReassignment[];
  remarks: string | null;
};

export type ZoneBookEntry = {
  zoneBook: string;
  zone: string;
  book: string;
  area?: { name: string };
  day?: number | null;
};

export type ZonebookProgress = {
  meterReader: { id: string; name: string };
  zone: string;
  book: string;
  totalRead: number;
  totalAccounts: number;
  statusProgress: string;
  readingDate: string;
  isCommitted: boolean;
  // isRead: boolean;
  address: string;
};

export type ZonebookProgressWithAccounts = ZonebookProgress & { accounts: AccountDetails[] };
