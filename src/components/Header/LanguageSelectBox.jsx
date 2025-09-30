import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import selectedLang from "../../assets/icon/selectedLang.svg";

const languages = [
  { code: "en", label: "English" },
  { code: "ar", label: "Arabic (عربي)" },
];

export const LanguageSelectBox = () => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const rtlLanguages = ["ar"];
    document.documentElement.dir = rtlLanguages.includes(i18n.language)
      ? "rtl"
      : "ltr";
  }, [i18n.language]);

  const handleSelect = (value) => {
    i18n.changeLanguage(value);
    setOpen(false);
  };

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

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer text-xs md:text-sm"
      >
        {languages.find((l) => l.code === i18n.language)?.label}
        <i className="fa-solid fa-angle-down fa-sm ml-auto" />
      </button>

      {open && (
        <div className={`absolute top-6 ${i18n.language === "ar" ? "left-0" : "-right-7"} mt-2 w-40 rounded-md bg-white shadow-lg border p-2 z-50`}>
          <p className="text-black text-sm mb-2">{t("chooseLang")}</p>
          <ul className="space-y-2">
            {languages.map((l) => (
              <li
                key={l.code}
                onClick={() => handleSelect(l.code)}
                className={`${
                  i18n.language === l.code ? "text-black" : "text-gray-600"
                } flex items-center justify-between cursor-pointer px-2 py-1 hover:text-black border-b border-gray-100`}
              >
                <span>{l.label}</span>
                {i18n.language === l.code && (
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
