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
import { useDispatch } from "react-redux";

function App() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSessionModal, setShowSessionModal] = useState(false);

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

  return (
    <>
      <ScrollToTop />
      <Router />
      <ToastContainer />
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
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
