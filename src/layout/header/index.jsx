import locationIcon from "../../assets/icon/locationIcon.svg";
import headerContact from "../../assets/icon/headerContact.svg";
import headLang from "../../assets/icon/headLang.svg";
import { useTranslation } from "react-i18next";
import { LanguageSelectBox } from "../../components/Header/LanguageSelectBox";
import { AllCitiesDropdown } from "../../components/Header/AllCitiesDropdown";

export const Header = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-black text-white text-tiny w-full py-2">
      <div className="flex justify-between items-center spacer-x">
        <div className="flex gap-2 items-center">
          <img src={locationIcon} alt="icon" />
          <AllCitiesDropdown />
        </div>
        <div className="flex gap-6 items-center">
          <div className="flex gap-2 items-center">
            <img src={headerContact} alt="icon" />
            <p>{t("contactUs")}</p>
          </div>
          <div className="flex gap-2 items-center">
            <img src={headLang} alt="icon" />
            <LanguageSelectBox />
          </div>
        </div>
      </div>
    </div>
  );
};
