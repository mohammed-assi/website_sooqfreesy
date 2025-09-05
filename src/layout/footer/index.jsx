import React from "react";
import logo from "../../assets/icon/footerLogo.svg";
import facebook from "../../assets/icon/facebook.svg";
import instagram from "../../assets/icon/instagram.svg";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-primaryDark text-white">
      <div className="spacer-x py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7">
          <div>
            <img src={logo} alt="SouqSyria" className="h-12 mb-4" />
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3">{t("aboutSouqSyria")}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#">{t("aboutUs")}</a>
              </li>
              <li>
                <a href="#">{t("termsConditions")}</a>
              </li>
              <li>
                <a href="#">{t("privacyPolicy")}</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3">{t("support")}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#">{t("contactUs")}</a>
              </li>
              <li>
                <a href="#">{t("FAQ")}</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3">{t("contactInfo")}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between gap-2">
                <p>{t("phoneNumber")}</p>
                <p>+963 1234567890</p>
              </li>
              <li className="flex justify-between">
                <p>{t("email")}</p>
                <p>arif123@gmail.com</p>
              </li>
              <li className="flex justify-between">
                <p>{t("address")}</p>
                <p>2nd Floor Building No. 447, Homs Syria</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/60 mt-8 pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sx text-center md:text-left font-bold">
            {t("copyRight")}
          </p>

          <div className="flex gap-4">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src={facebook} alt="Facebook" className="h-6 w-6" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src={instagram} alt="Instagram" className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
