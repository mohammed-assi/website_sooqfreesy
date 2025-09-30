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
import { setNotifications } from "../../../redux/slices/notificationSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ROUTE } from "../../../config/constants";

export const Notifictions = () => {
  const { i18n, t } = useTranslation();
  const imagePath = import.meta.env.VITE_APP_IMAGE_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleMarkNotificationRead = async (data) => {
    try {
      const response = await getRequest(
        `${NOTIFICATION.READ_NOTIFICATION}?notificationId=${data?.id}`
      );
      if (response?.data?.success && response?.data?.statusCode === 200) {
        const res = await getRequest(CUSTOMER.NOTIFICTIN_COUNT);
        if (res?.data?.success && res?.data?.statusCode === 200) {
          dispatch(setNotifications(res?.data?.data));
          if (data?.type === "REVIEW") {
            navigate(ROUTE.USER_PROFILE);
          } else if (data?.type === "POST") {
            navigate(ROUTE.MY_ADS);
          }
        }
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    }
  };

  const handleMarkAllNotificationRead = async () => {
    try {
      const response = await getRequest(`${NOTIFICATION.MARK_ALL_READ}`);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        const res = await getRequest(CUSTOMER.NOTIFICTIN_COUNT);
        if (res?.data?.success && res?.data?.statusCode === 200) {
          dispatch(setNotifications(res?.data?.data));
        }
        getgetNotificationDataCallback();
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    }
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
        <div className="lg:p-5">
          <div className="flex items-center justify-between">
            <h1 className="main-heading">{t("notification")}</h1>
            <div className="text-end flex gap-4">
              <p
                onClick={handleMarkAllNotificationRead}
                className="text-primary text-sm cursor-pointer hover:underline transition"
              >
                {t("markAllRead")}
              </p>
              <button onClick={() => setShowSetttingModal(true)}>
                <img src={notificationSetting} alt="icon" />
              </button>
            </div>
          </div>
          <div className="py-8 grid grid-cols-1 gap-6">
            {notificationList?.length ? (
              notificationList?.map((item, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (item?.is_read) {
                      if (item?.type === "REVIEW") {
                        navigate(ROUTE.USER_PROFILE);
                      } else if (item?.type === "POST") {
                        navigate(ROUTE.MY_ADS);
                      }
                    } else {
                      handleMarkNotificationRead(item);
                    }
                  }}
                  className={`${
                    item?.is_read ? "" : "bg-cyan-50"
                  } flex justify-between items-start gap-5 shadow-md rounded-md px-4 py-6 cursor-pointer relative`}
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
                  <p
                    className={`${
                      i18n?.language === "ar" ? "left-2.5" : "right-2.5"
                    } text-gray-600 w-[100px] text-right text-xs absolute top-2.5`}
                  >
                    {moment(item.created_at).fromNow()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-700">{t("noDataFound")}</p>
            )}
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
