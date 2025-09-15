import React, { useEffect, useState } from "react";
import defaultUser from "../../../assets/icon/defaultUser.svg";
import notificationSetting from "../../../assets/icon/notificationSetting.svg";
import SettingModal from "../../../components/notification/SettingModal";
import { useTranslation } from "react-i18next";
import { CUSTOMER } from "../../../config/endPoints";
import { showErrorToast } from "../../../utils/toastUtils";
import { getRequest } from "../../../config/apiFunctions";

export const Notifictions = () => {
  const { t } = useTranslation();
  const notitfications = [
    {
      imageUrl: defaultUser,
      text: "Lorem ipsum dolor sit amet consectetur. Blandit lobortis non mi non in mi vitae proin. Sit scelerisque cras donec magna dictum. Pharetra nibh tellus elementum convallis turpis urna dapibus turpis. Faucibus arcu laoreet faucibus libero. Volutpat suspendisse egestas mi id nullam imperdiet nunc. Amet risus enim eu vulputate sit mauris lacus velit magnis. Sed sapien ornare sit in.",
      time: "1 hr ago",
    },
    {
      imageUrl: defaultUser,
      text: "Lorem ipsum dolor sit amet consectetur. Blandit lobortis non mi non in mi vitae proin.",
      time: "2 hr ago",
    },
    {
      imageUrl: defaultUser,
      text: "Lorem ipsum dolor sit amet consectetur. Blandit lobortis non mi non in mi vitae proin. Sit scelerisque cras donec magna dictum. Pharetra nibh tellus elementum convallis turpis urna dapibus turpis. Amet risus enim eu vulputate sit mauris lacus velit magnis. Sed sapien ornare sit in.",
      time: "3 hr ago",
    },
    {
      imageUrl: defaultUser,
      text: "Lorem ipsum dolor sit amet consectetur. Blandit lobortis non mi non in mi vitae proin. Sit scelerisque cras donec magna dictum. Pharetra nibh tellus elementum convallis turpis urna dapibus turpis. Faucibus arcu laoreet faucibus libero. Volutpat suspendisse egestas mi id nullam imperdiet nunc.",
      time: "4 hr ago",
    },
  ];
  const [showSettingModal, setShowSetttingModal] = useState(false);
  const [notificationSettingsData, setNotificationSettingData] = useState({});

  const getNotificationSettingData = async (url) => {
    try {
      const response = await getRequest(url);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setNotificationSettingData(response?.data?.data);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    }
  };

  const getNotificationSettingDataCallback = () => {
    getNotificationSettingData(CUSTOMER.GET_NOTIFICATION_SETTNGS);
  };

  useEffect(() => {
    getNotificationSettingDataCallback();
  }, []);

  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <h1 className="main-heading">{t("notification")}</h1>
        <button onClick={() => setShowSetttingModal(true)}>
          <img src={notificationSetting} alt="icon" />
        </button>
      </div>
      <div className="py-8 grid grid-cols-1 gap-6">
        {notitfications.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-5 shadow-md rounded-md p-4"
          >
            <img
              src={item.imageUrl}
              alt="imageess"
              className="h-12 w-12 object-cover rounded-full"
            />
            <p className="text-gray-600">{item.text}</p>
            <p className="text-gray-600">{item.time}</p>
          </div>
        ))}
      </div>
      <SettingModal
        isOpen={showSettingModal}
        onClose={() => setShowSetttingModal(false)}
        settingData={notificationSettingsData}
        getNotificationSettingDataCallback={getNotificationSettingDataCallback}
      />
    </div>
  );
};
