import { useTranslation } from "react-i18next";
import infoModalIcon from "../../assets/icon/infoModalIcon.svg";
export const InfoModal = ({ onClose, title, subtitle }) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className=" flex flex-col items-center justify-center">
          <img src={infoModalIcon} alt="icon" className="h-15 w-15" />

          <h3 className="font-bold text-xl pt-6">{title}</h3>
          <p className="text-sm text-gray-500 pb-6">{subtitle}</p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-primary h-[50px] text-white hover:bg-primaryDark transition rounded font-medium"
        >
          {t("okay")}
        </button>
      </div>
    </div>
  );
};
