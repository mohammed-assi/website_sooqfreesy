import React, { useEffect, useState } from "react";
import defaultUser from "../../../assets/icon/defaultUser.svg";
import notificationSetting from "../../../assets/icon/notificationSetting.svg";
import SettingModal from "../../../components/notification/SettingModal";
import { useTranslation } from "react-i18next";
import { CUSTOMER, NOTIFICATION } from "../../../config/endPoints";
import { showErrorToast } from "../../../utils/toastUtils";
import { getRequest } from "../../../config/apiFunctions";
import { ScreenLoader } from "../../../utils/screenLoader";
import moment from "moment/moment";

export const Notifictions = () => {
  const { t } = useTranslation();
  const imagePath = import.meta.env.VITE_APP_IMAGE_URL;
  const [loading, setLoading] = useState(false);
  const [showSettingModal, setShowSetttingModal] = useState(false);
  const [notificationSettingsData, setNotificationSettingData] = useState({});
  const [notificationList, setNotificationList] = useState([]);

  const getNotificationSettingData = async (url) => {
    setLoading(true);
    try {
      const response = await getRequest(url);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setNotificationSettingData(response?.data?.data);
        setLoading(false);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
    setLoading(false);
  };

  const getNotificationSettingDataCallback = () => {
    getNotificationSettingData(CUSTOMER.GET_NOTIFICATION_SETTNGS);
  };

  const getNotificationData = async (url) => {
    setLoading(true);
    try {
      const response = await getRequest(url);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        console.log("response", response);
        setNotificationList(response?.data?.data);
        setLoading(false);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
    setLoading(false);
  };

  const getgetNotificationDataCallback = () => {
    getNotificationData(NOTIFICATION.GET);
  };

  useEffect(() => {
    getNotificationSettingDataCallback();
    getgetNotificationDataCallback();
  }, []);

  console.log("notificationList", notificationList);

  return (
    <>
      {loading ? (
        <ScreenLoader />
      ) : (
        <div className="p-5">
          <div className="flex items-center justify-between">
            <h1 className="main-heading">{t("notification")}</h1>
            <button onClick={() => setShowSetttingModal(true)}>
              <img src={notificationSetting} alt="icon" />
            </button>
          </div>
          <div className="py-8 grid grid-cols-1 gap-6">
            {notificationList?.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-start gap-5 shadow-md rounded-md px-4 py-6"
              >
                <div className="flex gap-5">
                  <img
                    src={
                      item.user_profile_url
                        ? `${imagePath}${item.user_profile_url}`
                        : defaultUser
                    }
                    alt="imageess"
                    className="h-12 w-12 object-cover rounded-full flex-shrink-0"
                  />

                  <div>
                    <p className="w-full text-lg">{item.title}</p>
                    <p className="text-gray-600 w-full">{item.message}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-base w-[100px] text-right">
                  {moment(item.created_at).fromNow()}
                </p>
              </div>
            ))}
          </div>
          <SettingModal
            isOpen={showSettingModal}
            onClose={() => setShowSetttingModal(false)}
            settingData={notificationSettingsData}
            getNotificationSettingDataCallback={
              getNotificationSettingDataCallback
            }
          />
        </div>
      )}
    </>
  );
};
