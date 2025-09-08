import { useTranslation } from "react-i18next";

const SettingModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-lg px-5 py-4">
        <div className="flex items-center justify-between border-b border-gray-200 py-4 ">
          <h2 className="text-2xl font-bold">{t("notificationSettings")}</h2>
          <button
            onClick={onClose}
            className="absolute top-8 right-6 text-gray-400 hover:text-gray-600"
          >
            <i className="fa-solid fa-xmark fa-lg" />
          </button>
        </div>

        <div className="py-4 space-y-6">
          <div>
            <h3 className="font-bold text-xl mb-4">{t("aboutMyAccount")}</h3>

            <div className="flex items-center justify-between py-5 border-b border-gray-200">
              <span className="text-sm text-gray-700">
                {t("hideContactDetails")}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-cyan-500 transition"></div>
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-5 border-b border-gray-200">
              <span className="text-sm text-gray-700">
                {t("otheruserAction")}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-cyan-500 transition"></div>
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-5 border-b border-gray-200">
              <span className="text-sm text-gray-700">
                {t("viewGeneralInfo")}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-cyan-500 transition"></div>
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition"></div>
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-4">
              {t("otherNotifications")}
            </h3>

            <div className="flex items-center justify-between py-5 border-b border-gray-200">
              <span className="text-sm text-gray-700">
                {t("offersNotifications")}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-cyan-500 transition"></div>
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-5">
              <span className="text-sm text-gray-700">
                {t("informationAboutads")}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-cyan-500 transition"></div>
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingModal;
