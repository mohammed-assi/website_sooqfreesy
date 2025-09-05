import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import selectedLang from "../../assets/icon/selectedLang.svg";

export const AllCitiesDropdown = () => {
  const { t } = useTranslation();

  const cities = [
    { value: "all", label: "All Cities" },
    { value: "al-hasakah", label: "Al-Hasakah" },
    { value: "aleppo", label: "Aleppo" },
    { value: "damascus", label: "Damascus" },
    { value: "daraa", label: "Daraa" },
    { value: "deir-ez-zor", label: "Deir ez-Zor" },
    { value: "hama", label: "Hama" },
    { value: "homs", label: "Homs" },
  ];

  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (city) => {
    setSelectedCity(city);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer"
      >
        {selectedCity.label}
        <i className="fa-solid fa-angle-down fa-sm ml-auto" />
      </button>

      {open && (
        <div className="absolute top-6 -right-15 mt-2 w-60 rounded-md bg-white shadow-lg border p-2 z-50">
          <p className="text-black text-bold text-sm mb-2">
            {t("chooseCity")}
          </p>
          <ul className="space-y-2">
            {cities.map((city) => (
              <li
                key={city.value}
                onClick={() => handleSelect(city)}
                className={`${
                  selectedCity.value === city.value
                    ? "text-black font-medium"
                    : "text-gray-600"
                } flex items-center justify-between cursor-pointer px-2 py-1 hover:text-black border-b border-gray-100`}
              >
                <span>{city.label}</span>
                {selectedCity.value === city.value && (
                  <img src={selectedLang} alt="icon" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
