import React from "react";
import logo from "../../assets/icon/footerLogo.svg";
import facebook from "../../assets/icon/facebook.svg";
import instagram from "../../assets/icon/ig.svg";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ROUTE } from "../../config/constants";

export const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primaryDark text-white">
      <div className="spacer-x py-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 gap-y-7 md:flex md:justify-between">
          <Link to={ROUTE.ROOT} className="col-span-2 sm:col-span-1">
            <img src={logo} alt="SouqSyria" className="h-12 mb-4 mx-auto sm:mx-0" />
          </Link>

          <div>
            <h3 className="font-bold text-lg mb-3">{t("aboutSouqSyria")}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to={ROUTE.ABOUT_US}>{t("aboutUs")}</Link>
              </li>
              <li>
                <Link to={ROUTE.TERMS_CONDITIONS}>{t("termsConditions")}</Link>
              </li>
              <li>
                <Link to={ROUTE.PRIVACY_POLICY}>{t("privacyPolicy")}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3">{t("support")}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to={ROUTE.HELP_SUPPORT} state={{ from: "contact" }}>
                  {t("contactUs")}
                </Link>
              </li>
              <li>
                <Link to={ROUTE.HELP_SUPPORT} state={{ from: "faq" }}>
                  {t("FAQ")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-bold text-lg mb-3">{t("contactInfo")}</h3>

            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <p className="w-[120px]">{t("phoneNumber")}</p>
                <p dir="ltr">+963 939865649</p>
              </li>
              <li className="flex gap-2">
                <p className="w-[120px]">{t("email")}</p>
                <p>souqsyria01@gmail.com</p>
              </li>
              <li className="flex gap-2">
                <p className="w-[120px]">{t("address")}</p>
                <div className="max-w-[260px] space-y-1">
                  <p>{t("addressSyria")}</p>
                  <p>{t("addressNetherlands")}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/60 mt-8 pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sx text-center md:text-left font-bold">
            © {year} {t("copyRight")}
          </p>

          <div className="flex gap-4">
            <Link
              to="https://www.facebook.com/share/16qav1EZia/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={facebook} alt="Facebook" className="h-6 w-6" />
            </Link>
            <Link
              to="https://www.instagram.com/souqfreesy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={instagram} alt="Instagram" className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
