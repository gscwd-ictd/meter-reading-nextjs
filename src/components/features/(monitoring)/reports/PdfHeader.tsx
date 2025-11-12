import { FunctionComponent } from "react";
import { StyleSheet, View, Image, Text, Font } from "@react-pdf/renderer";
import GSCWDLogo from "@images/main_logo_transparent2_wBG.png";

type HeaderProps = {
  isoCode?: string;
  withIsoLogo?: boolean;
  isFixed?: boolean;
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
    width: 60,
    height: 60,
    margin: "auto",
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
});

export const PdfHeader: FunctionComponent<HeaderProps> = ({ isFixed, isoCode, withIsoLogo }) => {
  return (
    <View style={[styles.rowContainer, { paddingBottom: 10, paddingTop: 5 }]} fixed={isFixed}>
      {/* Logo */}
      <View style={[styles.w20, { paddingRight: 30 }]}>
        <Image src={GSCWDLogo.src} style={[styles.gscwdLogo]} />
      </View>

      {/* CENTER  */}
      <View style={[styles.w60, styles.horizontalCenter]}>
        <Text style={{ fontSize: 10 }}>Republic of the Philippines</Text>
        <Text style={{ fontSize: 10, paddingTop: 2, fontFamily: "Helvetica-Bold", color: "#026fbd" }}>
          GENERAL SANTOS CITY WATER DISTRICT
        </Text>
        <Text style={{ fontSize: 10, paddingTop: 2 }}>
          E. Fernandez St., Brgy. Lagao, General Santos City
        </Text>
        <Text style={{ fontSize: 10, paddingTop: 2 }}>Telephone No.: 552-3824; Telefax No.: 553-4960</Text>
        <Text style={{ fontSize: 10, paddingTop: 2 }}>Email Address: gscwaterdistrict@yahoo.com</Text>
        <Text style={{ fontSize: 10, paddingTop: 1, color: "#126eb9" }}>www.gensanwater.gov.ph</Text>
      </View>

      {/* RIGHT */}
      <View style={[styles.w20, { paddingLeft: 30 }]}>
        {/* ISO CODE */}
        {!isoCode ? (
          <View style={[{ position: "absolute", right: 0 }]}>
            <Text style={{ fontSize: 8, fontFamily: "Helvetica" }}>{isoCode}</Text>
          </View>
        ) : null}
        {/* ISO LOGO */}
        {/* {withIsoLogo ? <Image src={IsoAccreditorLogo.src} style={[styles.isoLogo]} /> : null} */}
      </View>
    </View>
  );
};
