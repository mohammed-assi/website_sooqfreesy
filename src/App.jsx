import { useLocation, useNavigate } from "react-router-dom";
import { Router } from "./routes/Routes";
import { useEffect, useState } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ToastContainer } from "react-toastify";
import "react-phone-input-2/lib/style.css";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import infoModalIcon from "./assets/icon/sessionExpire.png";
import { useTranslation } from "react-i18next";
import ScrollToTop from "./utils/scrollToUp";
import { setupAxiosInterceptors } from "./config/apiFunctions";
import { useDispatch, useSelector } from "react-redux";

import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";
import { onBackgroundMessage } from "firebase/messaging/sw";

import { initializeApp } from "firebase/app";
import { setFcmToken } from "./redux/slices/tokenSlice";
import { showInfoToast } from "./utils/toastUtils";
import { setCount } from "./redux/slices/notificationSlice";
import "moment/locale/ar";
import moment from "moment/moment";


function App() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [notification, setNotification] = useState();
  const { count } = useSelector((state) => state.notification);

  useEffect(() => {
    NProgress.start();
    NProgress.configure({
      showSpinner: false,
    });
    const timer = setTimeout(() => {
      NProgress.done();
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [location]);

  useEffect(() => {
    const handleLanguageChange = () => {
      window.location.reload();
    };
    i18n.on("languageChanged", handleLanguageChange);
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  useEffect(() => {
    setupAxiosInterceptors(dispatch, navigate, setShowSessionModal);
  }, [dispatch, navigate]);

  useEffect(() => {
    const setupFirebase = async () => {
      const hasFirebaseMessagingSupport = await isSupported();

      if (!hasFirebaseMessagingSupport) {
        console.warn("Firebase Messaging is not supported in this browser.");
        return;
      }

      if (Notification.permission === "denied") {
        console.warn(
          "Notifications are blocked. Please enable them in browser settings."
        );
        return;
      }
      const firebaseConfig = {
        apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env
          .VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID,
      };

      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);

      try {
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );

        const currentToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_APP_FIREBASE_VAPIDKEY,
          serviceWorkerRegistration: registration,
        });

        if (currentToken) {
          dispatch(setFcmToken(currentToken));
        } else {
          console.log("No registration token available.");
        }
      } catch (err) {
        console.error("Error getting token:", err);
      }
      onMessage(messaging, (payload) => {
        console.log("messaging", payload);
        setNotification(payload?.notification);
      });
      onBackgroundMessage(messaging, (payload) => {
        console.log("onBackgroundMessage", payload);
        setNotification(payload?.notification);
      });
    };

    setupFirebase();
  }, []);

  useEffect(() => {
    if (notification) {
      showInfoToast(notification?.body);
      dispatch(setCount(count + 1));
    }
  }, [notification]);

  useEffect(() => {
    moment.locale(i18n.language);
  }, [i18n.language]);

  return (
    <>
      <ScrollToTop />
      <Router />
      <ToastContainer />
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className=" flex flex-col items-center justify-center">
              <img src={infoModalIcon} alt="icon" className="h-15 w-15" />

              <h3 className="font-bold text-xl pt-6">{t("sessionExpired")}</h3>
              <p className="text-sm text-gray-500 pb-6">{t("pleaseLogin")}</p>
            </div>

            <button
              onClick={() => setShowSessionModal(false)}
              className="w-full bg-primary hover:bg-primaryDark text-white py-3 rounded-lg font-medium transition"
            >
              {t("okay")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
