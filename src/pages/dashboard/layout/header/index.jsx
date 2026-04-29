import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../../../assets/icon/headerLogo.svg";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import defaultUser from "../../../../assets/icon/defaultUser.svg";
import profile from "../../../../assets/icon/profile.svg";
import ads from "../../../../assets/icon/ads.svg";
import wishlist from "../../../../assets/icon/wishlist.svg";
import notification from "../../../../assets/icon/notification.svg";
import support from "../../../../assets/icon/support.svg";
import login from "../../../../assets/icon/login.svg";
import logoutIcon from "../../../../assets/icon/logout.svg";
import signin from "../../../../assets/icon/signin.svg";
import LoginModal from "../../../../components/auth/LoginModal";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../../redux/slices/authSlice";
import { showInfoToast, showSuccessToast } from "../../../../utils/toastUtils";
import { clearUser } from "../../../../redux/slices/userSlice";
import { ROUTE } from "../../../../config/constants";
import { getRequest } from "../../../../config/apiFunctions";
import {
  setCount,
  setNotifications,
} from "../../../../redux/slices/notificationSlice";
import { CUSTOMER, NOTIFICATION } from "../../../../config/endPoints";
import { set } from "nprogress";

export const DashboardHeader = ({ setOpenSideBar, openSideBar }) => {
  const { t } = useTranslation();
  const profileDropdownRef = useRef(null);
  const loginDropdownRef = useRef(null);
  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const imagePath = import.meta.env.VITE_APP_IMAGE_URL;
  const { accessToken } = useSelector((state) => state.auth);
  const { userInfo } = useSelector((state) => state.user);
  const { notifications } = useSelector((state) => state.notification);
  const { count } = useSelector((state) => state.notification);
  const [open, setOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { i18n } = useTranslation();

  const handleMenuToggle = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target) &&
        loginDropdownRef.current &&
        !loginDropdownRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleScroll() {
      setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
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

  const handlegetCounter = async (url) => {
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      dispatch(setNotifications(response?.data?.data));
    }
  };

  useEffect(() => {
    handlegetCounter(CUSTOMER.NOTIFICTIN_COUNT);
  }, [accessToken]);

  const handlegetNotificationCount = async (url) => {
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      dispatch(setCount(response?.data?.data?.notificationCount));
    }
  };

  useEffect(() => {
    handlegetNotificationCount(NOTIFICATION.COUNTS);
  }, [accessToken]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint in Tailwind
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* <div
        className={`transition-colors duration-300 ${
          isScrolled ? "bg-white/85 backdrop-blur-lg" : "bg-white"
        } border-b border-gray-200`}
      >
        <div className="px-5 py-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-9 items-center">
              <Link to="/">
                <img src={logo} alt="logo" />
              </Link>
              {location.pathname !== ROUTE.CREATE_POST && (
                <div className="flex items-center gap-8 relative border-l-1 border-[#DDDDDD] pl-[50px]">
                  <Link
                    to="/"
                    className="flex font-bold text-base gap-4 items-center px-5 py-[10px] border-2 border-primary rounded text-primary hover:bg-primary hover:text-white cursor-pointer transition"
                  >
                    <i className="fa-solid fa-arrow-left" />
                    <p>{t("backSouqSyria")}</p>
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
                            {userInfo?.email || "example@gmail.com"}
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
                        <li className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 rounded-lg">
                          <button
                            onClick={() => {
                              navigate(ROUTE.HELP_SUPPORT);
                              setOpen(false);
                            }}
                            className="flex items-center gap-3 "
                          >
                            <img src={support} alt="icon" /> {t("helpSupport")}
                          </button>
                        </li>
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
              )}
            </div>
            {location.pathname !== ROUTE.CREATE_POST ? (
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
                <button
                  onClick={() => {
                    // navigate(ROUTE.CREATE_POST);
                    if (userInfo?.is_phone_verified && userInfo?.username) {
                      navigate(ROUTE.CREATE_POST);
                    } else {
                      showInfoToast(t("verifyPhoneNumber"));
                    }
                  }}
                  className="custom-btn"
                >
                  <span className="icon ">
                    <span>+</span> {t("postAdButton")}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)}>
                  <i className="fa-solid fa-xmark-large" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div> */}
      <header className="header bg-white">
        <div className="">
          <nav className="navigation-wrap flex gap-3 lg:gap-7 items-center py-2.5 lg:py-6 border-b border-gray-100">
            <div
              className={`item-left px-3 lg:px-9 ${
                i18n.language === "ar"
                  ? "border-l border-l-gray-300"
                  : "border-r border-r-gray-300"
              }`}
            >
              <Link to="/">
                <img src={logo} className="h-12 object-contain" alt="logo" />
              </Link>
            </div>
            <div
              className={`item-right flex items-center ${
                i18n.language === "ar"
                  ? "flex-row-reverse lg:justify-between"
                  : "justify-end lg:justify-between"
              } gap-3 lg:gap-8 w-full ${
                i18n.language === "ar"
                  ? "pl-3 lg:pl-[62px]"
                  : "pr-3 lg:pr-[62px]"
              }`}
            >
              {/* <button
                className="lg:hidden p-2 bg-gray-100 rounded-lg"
                onClick={() => setOpenSideBar(!openSideBar)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                  >
                    <path d="M22 12c0-3.75 0-5.625-.955-6.939a5 5 0 0 0-1.106-1.106C18.625 3 16.749 3 13 3h-2c-3.75 0-5.625 0-6.939.955A5 5 0 0 0 2.955 5.06C2 6.375 2 8.251 2 12s0 5.625.955 6.939a5 5 0 0 0 1.106 1.106C5.375 21 7.251 21 11 21h2c3.75 0 5.625 0 6.939-.955a5 5 0 0 0 1.106-1.106C22 17.625 22 15.749 22 12Zm-7.5-8.5v17" />
                    <path
                      stroke-linecap="round"
                      d="M19 7h-1.5m1.5 4h-1.5M8 10l1.227 1.057c.515.445.773.667.773.943s-.258.498-.773.943L8 14"
                    />
                  </g>
                </svg>
              </button> */}

              {accessToken && (
                <div className="flex items-center gap-4 w-full lg:hidden justify-end">
                  <Link to={ROUTE.NOTIFICATIONS} className="relative">
                    <img
                      src={notification}
                      alt="icon"
                      style={{ height: "24px", width: "24px" }}
                    />
                    {count > 0 && (
                      <p className="absolute -top-1 -right-2 text-[12px] bg-primaryDark text-white rounded-full size-4 flex items-center justify-center">
                        {count}
                      </p>
                    )}
                  </Link>
                  <Link to={ROUTE.WISHLIST} className="relative">
                    <img
                      src={wishlist}
                      alt="icon"
                      style={{ height: "24px", width: "24px" }}
                    />
                    {notifications?.wishlistCount > 0 && (
                      <p className="absolute -top-1 -right-2 text-[12px] bg-primaryDark text-white rounded-full size-4 flex items-center justify-center">
                        {notifications?.wishlistCount}
                      </p>
                    )}
                  </Link>
                  <Link to={ROUTE.MY_ADS} className="relative">
                    <img
                      src={ads}
                      alt="icon"
                      style={{ height: "24px", width: "24px" }}
                    />
                  </Link>
                </div>
              )}

              <button
                onClick={() => {
                  if (accessToken) {
                    if (userInfo?.is_phone_verified && userInfo?.username) {
                      navigate(ROUTE.CREATE_POST);
                    } else {
                      showInfoToast(t("verifyPhoneNumber"));
                    }
                  } else {
                    setShowLoginModal(true);
                  }
                }}
                className="custom-btn lg:w-auto flex lg:!hidden flex-shrink-0"
              >
                <span className="icon w-full lg:w-auto justify-center rounded-sm !px-2">
                  <i className="fa-solid fa-plus inline-block"></i>
                  {/* {t("postAdButton")} */}
                </span>
              </button>

              <Link
                to="/"
                className={`hidden lg:flex font-bold text-base gap-4 items-center lg:px-5 px-2.5 py-[10px] border-2 border-primary rounded text-primary hover:bg-primary hover:text-white cursor-pointer transition flex-shrink-0 ${
                  i18n.language === "ar"
                    ? "mr-auto lg:mr-auto"
                    : "ml-auto lg:ml-auto"
                }`}
              >
                <i className="fa-solid fa-arrow-left text-xs md:text-lg" />
                <p className="hidden lg:block">{t("backSouqSyria")}</p>
              </Link>
              <div
                className={`menu-wrap flex w-full justify-between z-10 lg:transform-none transition-all duration-300 ease-in-out lg:static lg:bg-transparent lg:shadow-none lg:h-auto lg:flex-row lg:items-center lg:gap-6 lg:justify-end flex-col bg-white shadow-lg top-0 left-0 h-full ${
                  menuOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0`}
              >
                <img src={logo} className="mb-10 lg:hidden h-7" alt="" />
                <div className="flex flex-col lg:flex-row items-center justify-between w-full">
                  {location.pathname !== ROUTE.CREATE_POST && (
                    <div
                      className="relative w-full lg:w-auto"
                      ref={profileDropdownRef}
                    >
                      <div
                        className="cursor-pointer flex justify-center"
                        onClick={() => setOpen(!open)}
                      >
                        <div className="flex items-center gap-3 py-2 px-2 bg-gray-100 rounded-md lg:rounded-none lg:bg-transparent lg:py-0 lg:border-gray-200 w-full justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                userInfo?.user_profile_url
                                  ? `${imagePath}/${userInfo.user_profile_url}`
                                  : defaultUser
                              }
                              alt="icon"
                              className="w-14 h-12 object-cover rounded-md border-3 border-blue-100"
                            />
                            <div className="lg:hidden">
                              <h3 className="font-bold">
                                {userInfo?.username || "User Name"}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {userInfo?.email || "example@gmail.com"}
                              </p>
                            </div>
                          </div>
                          <i className="fa-solid fa-angle-down fa-sm !hidden lg:!flex" />
                        </div>
                      </div>
                      {(isMobile || open) && (
                        <div
                          className={`${
                            i18n.language === "ar" ? "-left-10" : "-right-10"
                          } static lg:absolute lg:px-4 -right-10 lg:mt-2 lg:w-80 rounded-xl bg-white lg:shadow-lg z-50 p-2.5 lg:py-0 border border-gray-100 lg:border-0 mb-0`}
                        >
                          <div className="items-center gap-3 py-2 px-2 bg-gray-100 rounded-md lg:rounded-none lg:bg-transparent lg:border-b lg:border-gray-200 hidden lg:flex">
                            <div className="w-[50px] h-[40px] lg:w-[70px] lg:h-[60px] rounded flex items-center justify-center">
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
                                {userInfo?.email || "example@gmail.com"}
                              </p>
                            </div>
                          </div>

                          <ul>
                            <li
                              onClick={() => {
                                setOpen(false);
                                navigate(ROUTE.USER_PROFILE);
                              }}
                              className="px-2 py-2 lg:first:pt-4 lg:py-4 cursor-pointer hover:bg-gray-100 hover:rounded-md border-b border-gray-100"
                            >
                              <div className="flex items-center gap-3">
                                <img src={profile} alt="icon" /> {t("profile")}
                              </div>
                            </li>
                            <li
                              onClick={() => {
                                setOpen(false);
                                navigate(ROUTE.MY_ADS);
                              }}
                              className="px-2 py-2 lg:first:pt-4 lg:py-4 cursor-pointer hover:bg-gray-100 hover:rounded-md border-b border-gray-100"
                            >
                              <div className="flex items-center gap-3">
                                <img src={ads} alt="icon" />
                                {t("myAds")}
                              </div>
                            </li>
                            <li
                              onClick={() => {
                                setOpen(false);
                                navigate(ROUTE.WISHLIST);
                              }}
                              className="px-2 py-2 lg:first:pt-4 lg:py-4 cursor-pointer hover:bg-gray-100 hover:rounded-md border-b border-gray-100"
                            >
                              <div className="flex items-center gap-3">
                                <img src={wishlist} alt="icon" />{" "}
                                {t("wishlist")}
                              </div>
                            </li>
                            <li
                              onClick={() => {
                                setOpen(false);
                                navigate(ROUTE.NOTIFICATIONS);
                              }}
                              className="px-2 py-2 lg:first:pt-4 lg:py-4 cursor-pointer hover:bg-gray-100 hover:rounded-md border-b border-gray-100"
                            >
                              <div className="flex items-center gap-3 ">
                                <img src={notification} alt="icon" />
                                {t("notification")}
                              </div>
                            </li>
                            <li className="px-2 py-2 lg:pb-4 lg:py-4 cursor-pointer hover:bg-gray-100 hover:rounded-md">
                              <button
                                onClick={() => {
                                  navigate(ROUTE.HELP_SUPPORT);
                                  setOpen(false);
                                }}
                                className="flex items-center gap-3 "
                              >
                                <div className="flex items-center gap-3">
                                  <img src={support} alt="icon" />{" "}
                                  {t("helpSupport")}
                                </div>
                              </button>
                            </li>
                          </ul>

                          <div className="border-t border-gray-200 p-2">
                            {accessToken ? (
                              <button
                                onClick={handleLogout}
                                className="flex text-red-700 items-center gap-3 px-2 py-2 lg:pt-4 lg:py-4 w-full hover:bg-gray-100 rounded-b-xl cursor-pointer"
                              >
                                <img src={logoutIcon} alt="icon" />
                                {t("logout")}
                              </button>
                            ) : (
                              <button
                                onClick={handleShowLoginModal}
                                className="flex items-center gap-3 px-2 py-2 lg:pt-4 lg:py-4 w-full hover:bg-gray-100 rounded-b-xl cursor-pointer"
                              >
                                <img src={login} alt="icon" />
                                {t("login")}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {location.pathname !== ROUTE.CREATE_POST ? (
                    <div className="flex flex-col lg:flex-row w-full lg:w-auto items-center lg:mt-0">
                      <div
                        className="relative w-full lg:w-auto"
                        ref={loginDropdownRef}
                      >
                        {accessToken ? (
                          <div className="flex gap-7 items-center px-0 lg:px-7 py-4 lg:py-0 justify-around">
                            <Link
                              to={ROUTE.NOTIFICATIONS}
                              className="h-9 w-9 flex justify-center items-center lg:size-auto relative"
                            >
                              <img src={notification} alt="icon" />
                              {count > 0 && (
                                <p className="absolute -top-1 -right-2 text-[12px] bg-primaryDark text-white rounded-full size-4 flex items-center justify-center">
                                  {count}
                                </p>
                              )}
                            </Link>
                            <Link
                              to={ROUTE.WISHLIST}
                              className="h-9 w-9 flex justify-center items-center lg:size-auto relative"
                            >
                              <img src={wishlist} alt="icon" />
                              {notifications?.wishlistCount > 0 && (
                                <p className="absolute -top-1 -right-2 text-[12px] bg-primaryDark text-white rounded-full size-4 flex items-center justify-center">
                                  {notifications?.wishlistCount}
                                </p>
                              )}
                            </Link>
                            <Link
                              to={ROUTE.MY_ADS}
                              className="h-9 w-9 flex justify-center items-center lg:size-auto"
                            >
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
                      <button
                        onClick={() => {
                          // navigate(ROUTE.CREATE_POST);
                          if (
                            userInfo?.is_phone_verified &&
                            userInfo?.username
                          ) {
                            navigate(ROUTE.CREATE_POST);
                          } else {
                            showInfoToast(t("verifyPhoneNumber"));
                          }
                        }}
                        className="custom-btn w-full lg:w-auto"
                      >
                        <span className="icon w-full lg:w-auto justify-center rounded-sm">
                          <span>
                            <i className="fa-solid fa-plus"></i>
                          </span>{" "}
                          {t("postAdButton")}
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <button onClick={() => navigate(-1)}>
                        <i className="fa-solid fa-xmark-large" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`menu-overlay lg:hidden bg-black/75 w-full h-full fixed top-0 left-0 backdrop-blur-xs opacity-0 pointer-events-none transition-all duration-300 ease-in-out ${
                  menuOpen && "opacity-100 !pointer-events-auto cursor-pointer"
                }`}
                onClick={handleMenuToggle}
              ></div>
              <div className="hamburger lg:hidden" onClick={handleMenuToggle}>
                <i className="fa-solid fa-bars fa-lg" />
              </div>
            </div>
          </nav>
        </div>
      </header>
      <LoginModal
        show={showLoginModal}
        hide={() => setShowLoginModal(false)}
        setShowLoginModal={setShowLoginModal}
      />
    </>
  );
};
