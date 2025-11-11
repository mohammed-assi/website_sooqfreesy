import ReactCountryFlag from "react-country-flag";
import { getCode } from "country-list";

const aliasMap = {
  syria: "SY",
  usa: "US",
  uk: "GB",
  russia: "RU",
  iran: "IR",
  southkorea: "KR",
  northkorea: "KP",
  vietnam: "VN",
  laos: "LA",
  netherlands: "NL",
  india: "IN",
};

export default function CountryFlags({ countryName, countryCode, size = 20 }) {

   let finalCode = countryCode?.toUpperCase();

  if (!finalCode && countryName) {
    const normalized = countryName.toLowerCase().replace(/\s+/g, "");
    finalCode = aliasMap[normalized] || getCode(countryName) || "";
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {finalCode ? (
        <ReactCountryFlag
          countryCode={finalCode}
          svg
          style={{ width: `${size}px`, height: `${size}px` }}
          title={countryName || finalCode}
        />
      ) : (
        <span style={{ width: `${size}px`, marginRight: "8px" }}>.</span>
      )}
    </div>
  );
}
