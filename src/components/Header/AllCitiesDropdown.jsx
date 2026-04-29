import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Autocomplete from "react-google-autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { setLocationCoords } from "../../redux/slices/locationSlice";

export const AllCitiesDropdown = () => {
  const { i18n, t } = useTranslation();
  const GOOGLE_API_KEY = import.meta.env.VITE_APP_GOOGLE_API_KEY;
  const dispatch = useDispatch();
  const reduxCoords = useSelector((state) => state.location.coords);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null); // attach to wrapper
  const [location, setLocation] = useState("");

  // const handleUseMyLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       async (pos) => {
  //         const lat = pos.coords.latitude;
  //         const lng = pos.coords.longitude;

  //         try {
  //           const res = await fetch(
  //             `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
  //           );
  //           const data = await res.json();

  //           if (data.status === "OK") {
  //             const result = data.results[0];
  //             const countryObj = result.address_components.find((c) =>
  //               c.types.includes("country")
  //             );
  //             const country = countryObj ? countryObj.long_name : "";

  //             const newCoords = { lat, lng, country };
  //             setLocation(result.formatted_address);
  //             dispatch(setLocationCoords(newCoords));
  //             setOpen(false);
  //           }
  //         } catch (err) {
  //           console.error("Reverse geocoding failed:", err);
  //         }
  //       },
  //       (err) => {
  //         console.error("Error fetching location:", err);
  //         alert("Unable to fetch your location. Please allow location access.");
  //       }
  //     );
  //   } else {
  //     alert("Geolocation is not supported by your browser.");
  //   }
  // };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
          );
          const data = await res.json();

          if (data.status === "OK") {
            const result = data.results[0];
            const countryObj = result.address_components.find((c) =>
              c.types.includes("country")
            );
            const country = countryObj ? countryObj.long_name : "";

            const newCoords = { lat, lng, country };
            setLocation(result.formatted_address);
            dispatch(setLocationCoords(newCoords));
            setOpen(false);
          }
        } catch (err) {
          console.error("Reverse geocoding failed:", err);
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          alert(
            "Location access was denied. Please enable location permissions in your browser settings and try again."
          );
          // Optionally, you can guide the user to open settings with a link if supported
        } else {
          console.error("Error fetching location:", err);
          alert("Unable to fetch your location. Please try again.");
        }
      }
    );
  };

  useEffect(() => {
    function isClickInsidePacContainer(target) {
      // Google's autocomplete dropdown has class 'pac-container' (and children).
      return !!target?.closest?.(".pac-container");
    }

    function handleClickOutside(event) {
      const target = event.target;
      // if click is inside our wrapped component, don't close
      if (dropdownRef.current && dropdownRef.current.contains(target)) return;
      // if click is inside Google Places suggestion container, don't close
      if (isClickInsidePacContainer(target)) return;

      setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    // attach ref to the root wrapper so the button + dropdown are considered inside
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 cursor-pointer text-xs md:text-sm"
        type="button"
      >
        {reduxCoords?.country || t("chooseLocation")}
        <i className="fa-solid fa-angle-down fa-sm ml-auto" />
      </button>

      {open && (
        <div
          className={`${
            i18n.language === "ar"
              ? "lg:right-0 -right-3.5"
              : "-left-6 lg:-right-15"
          } absolute top-6 mt-2 w-3xs lg:w-80 rounded-md bg-white shadow-lg border p-2 z-50`}
        >
          <div className="w-full space-y-2 p-2">
            <p className="text-gray-800">{t("provideLocation")}</p>
            <button
              type="button"
              onClick={handleUseMyLocation}
              className="flex gap-1 items-center text-gray-700 text-sm hover:text-primaryDark transition"
            >
              <i className="fa-light fa-location-crosshairs" />
              {t("useMyLocation")}
            </button>

            <p className="block my-1 text-md text-gray-700 text-center">
              {t("or")}
            </p>

            <Autocomplete
              apiKey={GOOGLE_API_KEY}
              placeholder={t("nearbyLocation")}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onPlaceSelected={(place) => {
                if (place?.geometry?.location) {
                  const lat = place.geometry.location.lat();
                  const lng = place.geometry.location.lng();

                  const countryObj = place.address_components?.find((c) =>
                    c.types.includes("country")
                  );
                  const country = countryObj ? countryObj.long_name : "";
                  const newCoords = { lat, lng, country };
                  setLocation(place.formatted_address);
                  console.log("newCoords", newCoords);

                  dispatch(setLocationCoords(newCoords));
                  setOpen(false);
                } else {
                  console.warn("No geometry found for selected place:", place);
                }
              }}
              options={{ types: ["geocode"] }}
              className="w-full text-black rounded p-3 bg-gray-100 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};
