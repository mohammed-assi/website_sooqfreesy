// import React from "react";
// import ReactCountryFlag from "react-country-flag";
// import { getCode, getNames } from "country-list";

// export default function CountryFlags({ countryName }) {
//   // normalize case-insensitive
//   const countries = getNames(); // gives all valid country names
//   const matchedName = countries.find(
//     (name) => name.toLowerCase() === countryName.toLowerCase()
//   );

//   const code = matchedName ? getCode(matchedName) : null;

//   return (
//     <div style={{ display: "flex", alignItems: "center" }}>
//       {code ? (
//         <ReactCountryFlag
//           countryCode={code}
//           svg
//           style={{ width: "2em", height: "2em", marginRight: "8px" }}
//           title={countryName}
//         />
//       ) : (
//         <span style={{ width: "2em", marginRight: "8px" }}>❓</span> // fallback
//       )}
//       {countryName}
//     </div>
//   );
// }

import React from "react";
import ReactCountryFlag from "react-country-flag";
import { getCode, getNames } from "country-list";

// Aliases normalized without spaces and lowercase
const aliasMap = {
  syria: "Syrian Arab Republic",
  usa: "United States",
  uk: "United Kingdom",
  russia: "Russian Federation",
  iran: "Iran, Islamic Republic of",
  southkorea: "Korea, Republic of",
  northkorea: "Korea, Democratic People's Republic of",
  vietnam: "Viet Nam",
  laos: "Lao People's Democratic Republic",
};

export default function CountryFlags({ countryName, size = 20 }) {
  const countries = getNames();

  // Normalize input: lowercase, remove spaces
  const normalizedInput = countryName.toLowerCase().replace(/\s+/g, "");

  // Find official name from alias map or fallback to input
  const officialName =
    aliasMap[normalizedInput] || countryName;

  // Match with country-list names (case-insensitive)
  const matchedName =
    countries.find(
      (name) => name.toLowerCase() === officialName.toLowerCase()
    ) || null;

  const code = matchedName ? getCode(matchedName) : null;

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {code ? (
        <ReactCountryFlag
          countryCode={code}
          svg
          style={{ width: `${size}px`, height: `${size}px` }}
          title={countryName}
        />
      ) : (
        <span style={{ width: `${size}px`, marginRight: "8px" }}>❓</span>
      )}
    </div>
  );
}
