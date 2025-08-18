export type Holidays = typeof holidays;

export type Day = { id: string; name: string; date: string };
export type Holiday = Day & { type: string };

export const holidays = [
  // {
  //   id: "37e628bf-1c01-4030-85a7-3afd20c88ca1",
  //   name: "New Year",
  //   date: "January 01, 2025",
  //   type: "regular",
  // },
  {
    id: "82c7d91e-07c9-4bef-941d-ce5af66f37f0",
    name: "Chinese New Year",
    date: "January 29, 2025",
    type: "special",
  },
  {
    id: "fa322f83-7956-4efd-b0f2-21561d0586a3",
    name: "Kalilangan Festival",
    date: "2025-02-27",
    type: "special",
  },
  {
    id: "380a86f3-b92a-4d50-aed7-e542baa43cac",
    name: "Araw ng Kagitingan",
    date: "2025-04-09",
    type: "regular",
  },
  {
    id: "7b045a79-8260-4edb-b85b-d50838781c72",
    name: "Maundy Thursday",
    date: "2025-04-17",
    type: "regular",
  },
  {
    id: "24345c65-f196-4924-a8c4-3814efb6fe16",
    name: "Good Friday",
    date: "2025-04-18",
    type: "regular",
  },
  {
    id: "c4c1376f-8335-47e7-9ecc-dce20d39712d",
    name: "Black Saturday",
    date: "2025-04-19",
    type: "special",
  },
  {
    id: "26007302-8bc3-4846-8f3b-afeb8b9ee73d",
    name: "Tuna Festival",
    date: "2025-09-05",
    type: "special",
  },
  // {
  //   id: '26007302-8bc3-4846-8f3b-afeb8b9ee73d',
  //   name: 'Char',
  //   date: 'March 01, 2025',
  //   type: 'regular',
  // },
  // {
  //   id: '26007302-8bc3-4846-8f3b-afeb8b9ee73d',
  //   name: 'Char',
  //   date: 'March 02, 2025',
  //   type: 'regular',
  // },
  // {
  //   id: '26007302-8bc3-4846-8f3b-afeb8b9ee73d',
  //   name: 'Char',
  //   date: 'March 03, 2025',
  //   type: 'regular',
  // },
  // {
  //   id: '26007302-8bc3-4846-8f3b-afeb8b9ee73d',
  //   name: 'Char',
  //   date: 'March 04, 2025',
  //   type: 'regular',
  // },
  {
    id: "26007302-8bc3-4846-8f3b-afeb8b9ee73c",
    name: "Labor Day",
    date: "2025-05-01",
    type: "regular",
  },
  {
    id: "15dd3104-54ba-438b-be79-9261c9239885",
    name: "Independence Day",
    date: "2025-06-12",
    type: "regular",
  },
  {
    id: "5292feab-c528-4b88-afab-1fd974f3ce48",
    name: "Ninoy Aquino Day",
    date: "2025-08-21",
    type: "special",
  },
  {
    id: "39bc9494-dc50-4a67-a9a4-261be9509603",
    name: "National Heroes Day",
    date: "2025-08-25",
    type: "regular",
  },
  {
    id: "19b79099-bdd6-471f-acdb-da0c0c38bb7e",
    name: "All Saints' Day Eve",
    date: "2025-10-31",
    type: "special",
  },
  {
    id: "493fb24a-b34a-4813-90c9-740178a1f83f",
    name: "All Saints' Day",
    date: "2025-11-01",
    type: "special",
  },
  {
    id: "d2889502-ea14-4a7a-be3a-8ece85db89e1",
    name: "Bonifacio Day",
    date: "2025-11-30",
    type: "regular",
  },
  {
    id: "4bb38fef-d1d4-4852-8384-81a93d252f25",
    name: "Feast of the Immaculate Conception of Mary",
    date: "2025-12-08",
    type: "special",
  },
  {
    id: "4f9f997a-97d9-462c-a124-f82b621ee0a4",
    name: "Christmas Eve",
    date: "2025-12-24",
    type: "special",
  },
  // {
  //   id: "0a8584ce-690b-4f76-8127-e364ddd1c5eb",
  //   name: "Christmas Day",
  //   date: "December 25, 2025",
  //   type: "regular",
  // },
  {
    id: "a062a473-d9d7-4bdc-8ffa-cdc3ef70d2ac",
    name: "Rizal Day",
    date: "2025-12-30",
    type: "regular",
  },
  {
    id: "b5f4672f-f630-4bfd-b84c-3557fbb344c7",
    name: "Last Day of the Year",
    date: "2025-12-31",
    type: "special",
  },
];

export const NonBusinessDays: Day[] = [
  { id: "001", date: "01-01", name: "New Year" },
  { id: "002", date: "12-25", name: "Christmas Day" },
];
