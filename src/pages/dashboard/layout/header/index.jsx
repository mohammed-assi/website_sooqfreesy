import { Link, useNavigate } from "react-router-dom";
import logo from "../../../../assets/icon/headerLogo.svg";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import defaultUser from "../../../../assets/icon/defaultUser.svg";
import profile from "../../../../assets/icon/profile.svg";
import ads from "../../../../assets/icon/ads.svg";
import wishlist from "../../../../assets/icon/wishlist.svg";
import notification from "../../../../assets/icon/notification.svg";
// import support from "../../../../assets/icon/support.svg";
import login from "../../../../assets/icon/login.svg";
import logoutIcon from "../../../../assets/icon/logout.svg";
import signin from "../../../../assets/icon/signin.svg";
import LoginModal from "../../../../components/auth/LoginModal";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../../redux/slices/authSlice";
import { showSuccessToast } from "../../../../utils/toastUtils";
import { clearUser } from "../../../../redux/slices/userSlice";
import { ROUTE } from "../../../../config/constants";

export const DashboardHeader = () => {
  const { t } = useTranslation();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const imagePath = import.meta.env.VITE_APP_IMAGE_URL;
  const { accessToken } = useSelector((state) => state.auth);
  const { userInfo } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShowLoginModal = () => {
    setShowLoginModal(true);
    setOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUser());
    navigate(ROUTE.ROOT);
    setOpen(false);
    showSuccessToast(t("logOutMsg"));
  };

  return (
    <>
      <div
        className={`transition-colors duration-300 ${
          isScrolled ? "bg-white/85 backdrop-blur-lg" : "bg-white"
        } border-b border-gray-200`}
      >
        <div className="px-5 py-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <Link to="/">
                <img src={logo} alt="logo" />
              </Link>
              <div className="flex items-center gap-8 relative">
                <Link
                  to="/"
                  className="flex font-semibold gap-4 items-center px-7 py-3 border-2 border-primary rounded text-primary hover:bg-primary hover:text-white cursor-pointer transition"
                >
                  <i className="fa-solid fa-arrow-left" />
                  <p>{t("Back to SouqSyria")}</p>
                </Link>
                <div
                  className="cursor-pointer flex justify-center"
                  onClick={() => setOpen(!open)}
                >
                  <div className="w-14 h-12 flex items-center justify-center gap-2">
                    <img
                      src={
                        userInfo?.user_profile_url
                          ? `${imagePath}/${userInfo.user_profile_url}`
                          : defaultUser
                      }
                      alt="icon"
                      className="h-full w-full object-cover rounded-md border-3 border-blue-100"
                    />

                    <i className="fa-solid fa-angle-down fa-sm" />
                  </div>
                </div>
                {open && (
                  <div className="absolute top-15 -right-18 mt-2 w-80 rounded-xl bg-white shadow-lg z-50">
                    <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                      <div className="w-20 h-18 rounded flex items-center justify-center">
                        <img
                          src={
                            userInfo?.user_profile_url
                              ? `${imagePath}/${userInfo.user_profile_url}`
                              : defaultUser
                          }
                          alt="icon"
                          className="h-full w-full object-cover rounded"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold">
                          {userInfo?.username || "User Name"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {userInfo?.email || "Lorem ipsum semper urna"}
                        </p>
                      </div>
                    </div>

                    <ul className="p-2">
                      <li
                        onClick={() => {
                          setOpen(false);
                          navigate(ROUTE.USER_PROFILE);
                        }}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 rounded-lg border-b border-gray-100"
                      >
                        <img src={profile} alt="icon" /> {t("profile")}
                      </li>
                      <li
                        onClick={() => {
                          setOpen(false);
                          navigate(ROUTE.MY_ADS);
                        }}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 rounded-lg border-b border-gray-100"
                      >
                        <img src={ads} alt="icon" />
                        {t("myAds")}
                      </li>
                      <li
                        onClick={() => {
                          setOpen(false);
                          navigate(ROUTE.WISHLIST);
                        }}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 rounded-lg border-b border-gray-100"
                      >
                        <img src={wishlist} alt="icon" /> {t("wishlist")}
                      </li>
                      <li
                        onClick={() => {
                          setOpen(false);
                          navigate(ROUTE.NOTIFICATIONS);
                        }}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 rounded-lg border-b border-gray-100"
                      >
                        <img src={notification} alt="icon" />
                        {t("notification")}
                      </li>
                      {/* <li
                        onClick={() => {
                          setOpen(false);
                          navigate(ROUTE.HELP_SUPPORT);
                        }}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 rounded-lg"
                      >
                        <img src={support} alt="icon" />
                        {t("helpSupport")}
                      </li> */}
                    </ul>

                    <div className="border-t border-gray-200 p-2">
                      {accessToken ? (
                        <button
                          onClick={handleLogout}
                          className="flex text-red-700 items-center gap-3 px-4 py-5 w-full hover:bg-gray-100 rounded-b-xl cursor-pointer"
                        >
                          <img src={logoutIcon} alt="icon" />
                          {t("logout")}
                        </button>
                      ) : (
                        <button
                          onClick={handleShowLoginModal}
                          className="flex items-center gap-3 px-4 py-5 w-full hover:bg-gray-100 rounded-b-xl cursor-pointer"
                        >
                          <img src={login} alt="icon" />
                          {t("login")}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative" ref={dropdownRef}>
                {accessToken ? (
                  <div className="flex gap-7 items-center px-7 py-3">
                    <Link to={ROUTE.NOTIFICATIONS}>
                      <img src={notification} alt="icon" />
                    </Link>
                    <Link to={ROUTE.WISHLIST}>
                      <img src={wishlist} alt="icon" />
                    </Link>
                    <Link to={ROUTE.MY_ADS}>
                      <img src={ads} alt="icon" />
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => setOpen(!open)}
                    className="flex gap-4 items-center px-7 py-3 border border-primary rounded text-primary hover:bg-primary hover:text-white cursor-pointer transition group"
                  >
                    <img
                      src={signin}
                      alt="icon"
                      className="transition group-hover:brightness-0 group-hover:invert"
                    />
                    <p>{t("singIn")}</p>
                    <i className="fa-solid fa-angle-down fa-sm" />
                  </button>
                )}
              </div>
              <button className="flex font-bold gap-4 items-center px-7 py-3 border border-2 border-primaryDark rounded text-primaryDark cursor-pointer transition">
                <i className="fa-solid fa-plus" />
                <p>{t("postAdButton")}</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <LoginModal
        show={showLoginModal}
        hide={() => setShowLoginModal(false)}
        setShowLoginModal={setShowLoginModal}
      />
    </>
  );
};
