import { useLocation, useNavigate } from "react-router-dom";
import { Router } from "./routes/Routes";
import { useEffect, useState } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ToastContainer } from "react-toastify";
import "react-phone-input-2/lib/style.css";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { logout } from "./redux/slices/authSlice";
import { clearUser } from "./redux/slices/userSlice";
import { ROUTE } from "./config/constants";
import { useDispatch } from "react-redux";
import infoModalIcon from "./assets/icon/sessionExpire.png";
import { useTranslation } from "react-i18next";

function App() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          dispatch(logout());
          dispatch(clearUser());
          setShowSessionModal(true);
          navigate(ROUTE.ROOT);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  return (
    <>
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
