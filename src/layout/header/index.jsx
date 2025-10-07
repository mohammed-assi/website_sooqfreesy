import locationIcon from "../../assets/icon/locationIcon.svg";
import headerContact from "../../assets/icon/headerContact.svg";
import headLang from "../../assets/icon/headLang.svg";
import { useTranslation } from "react-i18next";
import { LanguageSelectBox } from "../../components/Header/LanguageSelectBox";
import { AllCitiesDropdown } from "../../components/Header/AllCitiesDropdown";
import { LOCAL_STORAGE, ROUTE } from "../../config/constants";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleCurrency } from "../../redux/slices/currencySlice";

export const Header = ({ ...props }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const currency = useSelector((state) => state.currency.value);

  const handleToggle = () => {
    dispatch(toggleCurrency());
  };

  console.log("currency--->", currency);

  return (
    <div className="bg-black text-white text-tiny w-full py-2">
      <div
        className={`flex justify-between items-center spacer-x ${props.className}`}
      >
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
          {/* <div className="flex gap-2 items-center">
            <span className="text-xs md:text-sm">$</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                class="sr-only peer"
                checked={currency === "SYP"}
                onChange={handleToggle}
              />
              <div class="group peer bg-transparent flex-shrink-0 rounded-full duration-300 w-[33px] h-[19px] ring-1 ring-white after:duration-300 after:bg-white peer-checked:after:bg-primary peer-checked:ring-primary after:rounded-full after:absolute after:h-3 after:w-3 after:top-[4px] after:left-[3px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-[14px] peer-hover:after:scale-95"></div>
            </label>
            <span className="text-xs md:text-sm text-primary">£</span>
          </div> */}

          <div className="flex gap-2 items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={currency === "SYP"}
                onChange={handleToggle}
              />
              <div className="w-14 h-8 bg-[#c7f3fc] rounded-full relative duration-300">
                <div
                  className={`absolute top-1 left-1 h-6 w-6 flex items-center justify-center rounded-full text-white font-bold text-lg duration-300
        ${
          currency === "SYP"
            ? "translate-x-6 bg-[#00b8e6]"
            : "translate-x-0 bg-[#00b8e6]"
        }`}
                >
                  {currency === "SYP" ? "£" : "$"}
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
