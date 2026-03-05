import { FunctionComponent } from "react";
import { StyleSheet, View, Image, Text, Font } from "@react-pdf/renderer";
import GSCWDLogo from "@images/main_logo_only.png";
import { format } from "date-fns";

type HeaderProps = {
  isoCode?: string;
  withIsoLogo?: boolean;
  isFixed?: boolean;
  page?: { current: number; total: number };
  dateTime?: Date;
  dateRange?: { from: Date; to: Date };
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  gscwdLogo: {
    width: 200,
    height: 110,
    marginLeft: -70,
    marginTop: -14,
    position: "absolute",
    center: 0,
    left: 1,
  },
  isoLogo: { width: 71, height: 46, margin: "auto" },

  // Border Styles
  bodyBorder: {
    margin: 10,
    border: "2px solid #000000",
  },
  borderTop: {
    borderTop: "1px solid #000000",
  },
  borderRight: {
    borderRight: "1px solid #000000",
  },

  // Field Styles
  headerText: {
    fontFamily: "ArialRegular",
    fontSize: 9,
    padding: 1,
    marginVertical: "auto",
  },
  documentCode: {
    // fontFamily: CalibriRegular.style.fontFamily,
    fontSize: 11,
    padding: "10 15 0 0",
    textAlign: "right",
    backgroundColor: "#DC143C",
  },
  arialSemiBold: {
    fontFamily: "ArialSemiBold",
    color: "#127abb",
  },
  website: {
    fontFamily: "ArialItalic",
    color: "#126eb9",
  },
  verticalCenter: { margin: "auto 0" },
  horizontalCenter: { textAlign: "center" },

  // Width Styles
  w100: { width: "100%" },
  w60: { width: "60%" },
  w40: { width: "40%" },
  w30: { width: "30%" },
  w20: { width: "20%" },
  w10: { width: "10%" },
});

export const PdfBillingSummaryHeader: FunctionComponent<HeaderProps> = ({
  isFixed,
  isoCode,
  page,
  dateTime,
  dateRange,
}) => {
  return (
    <View style={[styles.rowContainer, { paddingBottom: 20, paddingTop: 2 }]} fixed={isFixed}>
      {/* Logo */}
      <View style={[styles.w10, { textAlign: "center" }]}>
        <Image src={GSCWDLogo.src} style={[styles.gscwdLogo]} />
      </View>

      {/* Date Time */}
      <View style={[styles.w20, { flexDirection: "column", justifyContent: "flex-start", gap: 0 }]}>
        <View style={[styles.w100, { flexDirection: "row", justifyContent: "flex-start", gap: 4 }]}>
          <Text style={{ fontSize: 10 }}>Run Date :</Text>
          <Text style={{ fontSize: 10 }}>{dateTime ? format(dateTime, "MM/dd/yyyy") : null}</Text>
        </View>

        <View style={[styles.w100, { flexDirection: "row", justifyContent: "flex-start", gap: 4 }]}>
          <Text style={{ fontSize: 10 }}>Run Time :</Text>
          <Text style={{ fontSize: 10 }}>{dateTime ? format(dateTime, "hh:mm:ssa") : null}</Text>
        </View>
      </View>

      {/* CENTER  */}
      <View style={[styles.w40, styles.horizontalCenter]}>
        <Text style={{ fontSize: 11, color: "#0084db", fontWeight: "bold" }}>
          GENERAL SANTOS CITY WATER DISTRICT
        </Text>
        <Text style={{ fontSize: 10, paddingTop: 2 }}>
          E. Fernandez St., Brgy. Lagao, General Santos City
        </Text>
        <Text style={{ fontSize: 10, paddingTop: 2 }}>Telephone No.: 552-3824; Telefax No.: 553-4960</Text>
        <Text style={{ fontSize: 10, paddingTop: 2 }}>Email Address: gscwaterdistrict@yahoo.com</Text>
        <Text style={[{ fontWeight: "bold", fontSize: "10", paddingTop: 2 }]}>BILLING SUMMARY</Text>
        <Text style={{ fontSize: 10, fontWeight: "bold", paddingTop: 2, letterSpacing: 0.5 }}>
          {dateRange && dateRange.from ? format(dateRange.from, "MM/dd/yyyy") : ""} to{" "}
          {dateRange && dateRange.to ? format(dateRange.to, "MM/dd/yyyy") : ""}
        </Text>
      </View>

      {/* RIGHT */}
      <View style={[styles.w30, { paddingLeft: 30 }]}>
        {/* ISO CODE */}
        {isoCode ? (
          <View style={[styles.w100, { flexDirection: "row", justifyContent: "flex-end" }]}>
            <Text style={{ fontSize: 10, fontWeight: "Bold", fontFamily: "Helvetica" }}>{isoCode}</Text>
          </View>
        ) : null}
        <View style={[styles.w100, { flexDirection: "row", justifyContent: "flex-end" }]}>
          <Text style={{ fontSize: 11 }}>
            Page {page ? page.current : 1} of {page ? page.total : 1}
          </Text>
        </View>
        {/* <View
          style={[
            styles.w100,
            {
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              paddingRight: 0,
              height: "40px",
            },
          ]}
        >
          <Text style={{ fontSize: 10, fontWeight: "bold" }}>
            {dateRange && dateRange.from ? format(dateRange.from, "MM/dd/yyyy") : ""} to{" "}
            {dateRange && dateRange.to ? format(dateRange.to, "MM/dd/yyyy") : ""}
          </Text>
        </View> */}

        {/* ISO LOGO */}
        {/* {withIsoLogo ? <Image src={IsoAccreditorLogo.src} style={[styles.isoLogo]} /> : null} */}
      </View>
    </View>
  );
};
