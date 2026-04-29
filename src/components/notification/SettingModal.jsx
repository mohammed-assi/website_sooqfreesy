import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ToggleButton } from "../../common/toogleButton/ToggleButton";
import { postRequest } from "../../config/apiFunctions";
import { CUSTOMER } from "../../config/endPoints";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";

const SettingModal = ({
  isOpen,
  onClose,
  settingData,
  getNotificationSettingDataCallback,
}) => {
  const { i18n, t } = useTranslation();
  const [settings, setSettings] = useState(settingData);

  const handleToggle = async (field) => {
    const updatedSettings = { ...settings, [field]: !settings[field] };
    setSettings(updatedSettings);

    let payload;
    if (field === "ads_information") {
      payload = { ads_information: updatedSettings.ads_information };
    }
    if (field === "allow_account_actions") {
      payload = {
        allow_account_actions: updatedSettings.allow_account_actions,
      };
    }
    if (field === "hide_contact_details") {
      payload = { hide_contact_details: updatedSettings.hide_contact_details };
    }
    if (field === "offers_notifications") {
      payload = { offers_notifications: updatedSettings.offers_notifications };
    }
    if (field === "view_general_info") {
      payload = { view_general_info: updatedSettings.view_general_info };
    }
    try {
      const response = await postRequest(CUSTOMER.UPDATE_SETTING, payload);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        showSuccessToast(response?.data?.message);
        onClose();
        getNotificationSettingDataCallback();
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    if (isOpen && settingData) {
      setSettings(settingData);
    }
  }, [isOpen, settingData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-lg px-5 py-4">
        <div className="flex items-center justify-between border-b border-gray-200 py-4 ">
          <h2 className="text-xl font-bold">{t("notificationSettings")}</h2>
          <button
            onClick={onClose}
            className={`${
              i18n?.language === "ar" ? "left-6" : "right-6"
            } absolute top-8  text-gray-400 hover:text-gray-600`}
          >
            <i className="fa-solid fa-xmark fa-lg" />
          </button>
        </div>

        <div className="py-4 space-y-6">
          <div>
            <h3 className="font-bold text-xl mb-4">{t("aboutMyAccount")}</h3>

            <ToggleButton
              label={t("hideContactDetails")}
              checked={settings.hide_contact_details}
              onChange={() => handleToggle("hide_contact_details")}
            />

            <ToggleButton
              label={t("otheruserAction")}
              checked={settings.allow_account_actions}
              onChange={() => handleToggle("allow_account_actions")}
            />

            <ToggleButton
              label={t("viewGeneralInfo")}
              checked={settings.view_general_info}
              onChange={() => handleToggle("view_general_info")}
            />
          </div>

          <div>
            <h3 className="font-bold text-xl mb-4">
              {t("otherNotifications")}
            </h3>

            <ToggleButton
              label={t("offersNotifications")}
              checked={settings.offers_notifications}
              onChange={() => handleToggle("offers_notifications")}
            />

            <ToggleButton
              label={t("informationAboutads")}
              checked={settings.ads_information}
              onChange={() => handleToggle("ads_information")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingModal;
