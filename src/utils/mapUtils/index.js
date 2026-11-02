// Returns { lat, lng } as finite numbers in range, or null if either is missing/invalid.
export const toValidCoords = (lat, lng) => {
  if (lat === null || lat === undefined || lat === "") return null;
  if (lng === null || lng === undefined || lng === "") return null;

  const la = Number(lat);
  const lo = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(lo)) return null;
  if (Math.abs(la) > 90 || Math.abs(lo) > 180) return null;

  return { lat: la, lng: lo };
};

export const googleMapsLink = ({ lat, lng }) =>
  `https://www.google.com/maps?q=${lat},${lng}`;

// Nearby filter: use coordinates when valid, otherwise fall back to the typed
// location text as `searchtext` (never overriding an existing search term).
export const applyNearbyFilter = (filterObj, coords, locationText) => {
  const valid = toValidCoords(coords?.lat, coords?.lng);
  if (valid) {
    filterObj.latitude = valid.lat;
    filterObj.longitude = valid.lng;
    return;
  }

  const text = locationText?.trim();
  if (text && !filterObj.searchtext) filterObj.searchtext = text;
};
