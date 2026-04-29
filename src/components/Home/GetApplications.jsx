import React from "react";
import bgImage from "../../assets/image/getAppBg.png";
import phone from "../../assets/image/phoneApp.png";
import appStore from "../../assets/image/appStore.png";
import googlePlay from "../../assets/image/googlePlay.png";
import { useTranslation } from "react-i18next";

export const GetApplications = () => {
  const { t } = useTranslation();
  return (
    <div
      className="relative w-full bg-cover bg-center flex items-end"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="spacer-x flex flex-col lg:flex-row items-center justify-between w-full relative pb-0 gap-2">
        <div className="text-center lg:text-left max-w-lg space-y-6 py-12">
          <h2 className="main-heading">{t("downloadApp")}</h2>

          <div className="flex justify-center lg:justify-start gap-4">
            <a href="#" target="_blank">
              <img src={appStore} alt="App Store" className="h-12" />
            </a>
            <a href="#" target="_blank">
              <img src={googlePlay} alt="Google Play" className="h-12" />
            </a>
          </div>
        </div>

        <div className="relative self-center md:self-end">
          <img
            src={phone}
            alt="Phone App"
            className="w-[280px] md:w-[350px] lg:w-[400px] drop-shadow-2xl -mt-[45px]"
          />
        </div>
      </div>
    </div>
  );
};
