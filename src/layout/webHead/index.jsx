import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/icon/headerLogo.svg";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import defaultUser from "../../assets/icon/defaultUser.svg";
import profile from "../../assets/icon/profile.svg";
import ads from "../../assets/icon/ads.svg";
import wishlist from "../../assets/icon/wishlist.svg";
import notification from "../../assets/icon/notification.svg";
import support from "../../assets/icon/support.svg";
import login from "../../assets/icon/login.svg";
import logoutIcon from "../../assets/icon/logout.svg";
import signin from "../../assets/icon/signin.svg";
import LoginModal from "../../components/auth/LoginModal";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { showSuccessToast } from "../../utils/toastUtils";
import { clearUser } from "../../redux/slices/userSlice";
import { ROUTE } from "../../config/constants";

export const WebHead = () => {
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const popularSearches = [
    t("cars"),
    t("bikes"),
    t("land"),
    t("offices"),
    t("washingMachine"),
    t("phone"),
    t("laptop"),
  ];

  const userDropDown = [
    { name: t("profile"), imgUrl: profile, slug: ROUTE.USER_PROFILE },
    { name: t("myAds"), imgUrl: ads, slug: ROUTE.MY_ADS },
    { name: t("wishlist"), imgUrl: wishlist, slug: ROUTE.WISHLIST },
    {
      name: t("notification"),
      imgUrl: notification,
      slug: ROUTE.NOTIFICATIONS,
    },
  ];

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

  const goToProductPage = () => {
    setSearchOpen(false);
    if (searchValue !== "") {
      navigate(ROUTE.PRODUCT_PAGE, { state: { searchText: searchValue } });
    }
  };

  const handleNavigate = (slug) => {
    if (accessToken) {
      navigate(slug);
    } else {
      setShowLoginModal(true);
    }
    setOpen(false);
    setSearchOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setOpen(false);
        setSearchOpen(false);
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div
        className={`transition-colors duration-300 ${
          isScrolled ? "bg-white/85 backdrop-blur-lg" : "bg-white"
        } border-b border-gray-200`}
      >
        <div className="spacer-x py-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-6 items-center">
              <Link to="/">
                <img src={logo} alt="logo" />
              </Link>
              {isScrolled && location.pathname !== ROUTE.CREATE_POST && (
                <div className="relative" ref={searchRef}>
                  <div className="rounded-lg px-4 py-3 flex justify-between items-center bg-gray-100">
                    <input
                      type="text"
                      placeholder={t("searchPlaceholder")}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onFocus={() => setSearchOpen(true)}
                      className="w-full focus:outline-none "
                    />
                    <button
                      onClick={goToProductPage}
                      disabled={searchValue === ""}
                    >
                      <i className="fa-regular fa-magnifying-glass fa-lg" />
                    </button>
                  </div>

                  {searchOpen && (
                    <div className="absolute mt-2 w-80 rounded-xl bg-white shadow-lg z-50">
                      <div className="p-4">
                        <h3 className="font-semibold">
                          {t("popularSearches")}
                        </h3>
                      </div>
                      <ul className="">
                        {popularSearches.map((item) => (
                          <li
                            key={item}
                            onClick={() => setSearchValue(item)}
                            className="px-4 py-3 text-gray-700 cursor-pointer hover:bg-gray-100 border-t border-gray-100"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
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
                    </div>
                  ) : (
                    <button
                      onClick={() => setOpen(!open)}
                      className="flex font-bold gap-4 items-center px-7 py-3 border-2 border-primary rounded text-primary hover:bg-primary hover:text-white cursor-pointer transition group"
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
                  {open && (
                    <div className="absolute px-4 -right-10 mt-2 w-80 rounded-xl bg-white shadow-lg z-50">
                      <div className="flex items-center gap-3 py-4 border-b border-gray-200">
                        <div className="w-[70px] h-[60px] rounded flex items-center justify-center">
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
                            {userInfo?.username || t("UserName")}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {userInfo?.email || "example@gmail.com"}
                          </p>
                        </div>
                      </div>

                      <ul className="py-2 mb-1">
                        {userDropDown?.map((item, i) => (
                          <li
                            key={i}
                            className="px-2 py-4 cursor-pointer hover:bg-gray-100 hover:rounded-md border-b border-gray-100"
                          >
                            <button
                              onClick={() => handleNavigate(item.slug)}
                              className="flex items-center gap-3 "
                            >
                              <img src={item.imgUrl} alt="icon" /> {item.name}
                            </button>
                          </li>
                        ))}
                        <li className="px-2 py-4 cursor-pointer hover:bg-gray-100 hover:rounded-md ">
                          <button
                            onClick={() => {
                              navigate(ROUTE.HELP_SUPPORT);
                              setOpen(false);
                              setSearchOpen(false);
                            }}
                            className="flex items-center gap-3 "
                          >
                            <img src={support} alt="icon" /> {t("helpSupport")}
                          </button>
                        </li>
                      </ul>

                      <div className="border-t border-gray-200 py-2">
                        {accessToken ? (
                          <button
                            onClick={handleLogout}
                            className="flex text-red-700 items-center gap-3 px-2 py-5 w-full hover:bg-gray-100 rounded-md cursor-pointer"
                          >
                            <img src={logoutIcon} alt="icon" />
                            {t("logout")}
                          </button>
                        ) : (
                          <button
                            onClick={handleShowLoginModal}
                            className="flex items-center gap-3 px-2 py-5 w-full hover:bg-gray-100 rounded-md cursor-pointer"
                          >
                            <img src={login} alt="icon" />
                            {t("login")}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (accessToken) {
                      navigate(ROUTE.CREATE_POST);
                    } else {
                      setShowLoginModal(true);
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
      </div>

      <LoginModal
        show={showLoginModal}
        hide={() => setShowLoginModal(false)}
        setShowLoginModal={setShowLoginModal}
      />
    </>
  );
};
