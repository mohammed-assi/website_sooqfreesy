import locationIcon from "../../assets/icon/locationIcon.svg";
import headerContact from "../../assets/icon/headerContact.svg";
import headLang from "../../assets/icon/headLang.svg";
import { useTranslation } from "react-i18next";
import { LanguageSelectBox } from "../../components/Header/LanguageSelectBox";
import { AllCitiesDropdown } from "../../components/Header/AllCitiesDropdown";
import { ROUTE } from "../../config/constants";
import { Link } from "react-router-dom";

export const Header = ({...props}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-black text-white text-tiny w-full py-2">
      <div className={`flex justify-between items-center spacer-x ${props.className}`}>
        <div className="flex gap-2 items-center">
          <img src={locationIcon} className="h-4 md:h-5" alt="icon" />
          <AllCitiesDropdown />
        </div>
        <div className="flex gap-6 items-center">
          <Link
            to={ROUTE.HELP_SUPPORT}
            state={{ from: "contact" }}
            className="flex gap-2 items-center"
          >
            <img src={headerContact} className="h-4 md:h-5" alt="icon" />
            <p className="text-xs md:text-sm">{t("contactUs")}</p>
          </Link>
          <div className="flex gap-2 items-center">
            <img src={headLang} className="h-4 md:h-5" alt="icon" />
            <LanguageSelectBox />
          </div>
        </div>
      </div>
    </div>
  );
};
