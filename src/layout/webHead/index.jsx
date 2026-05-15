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
import { showInfoToast, showSuccessToast } from "../../utils/toastUtils";
import { clearUser } from "../../redux/slices/userSlice";
import { ROUTE } from "../../config/constants";
import { getRequest } from "../../config/apiFunctions";
import { CUSTOMER, NOTIFICATION, POST } from "../../config/endPoints";
import { setCount, setNotifications } from "../../redux/slices/notificationSlice";
import Catbar from "../../components/Home/Catbar";

export const WebHead = () => {
  const { t } = useTranslation();
  const profileDropdownRef = useRef(null);
  const mobileProfileRef = useRef(null);
  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const imagePath = import.meta.env.VITE_APP_IMAGE_URL;
  const { accessToken } = useSelector((state) => state.auth);
  const { userInfo } = useSelector((state) => state.user);
  const { notifications } = useSelector((state) => state.notification);
  const { count } = useSelector((state) => state.notification);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestionList, setSuggestionList] = useState([]);
  const [allCategory, setAllCategory] = useState([]);

  const handleMenuToggle = () => setMenuOpen(!menuOpen);

  const userDropDown = [
    { name: t("profile"), imgUrl: profile, slug: ROUTE.USER_PROFILE },
    { name: t("myAds"), imgUrl: ads, slug: ROUTE.MY_ADS },
    { name: t("wishlist"), imgUrl: wishlist, slug: ROUTE.WISHLIST },
    { name: t("notification"), imgUrl: notification, slug: ROUTE.NOTIFICATIONS },
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

  const goToProductPage = (value) => {
    const query = value || searchValue.trim();
    if (!query) return;
    setSearchOpen(false);
    setSuggestionList([]);
    setSearchValue(query);
    navigate(ROUTE.PRODUCT_PAGE, { state: { searchText: query } });
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

  const handleCheckSuggestions = async (url) => {
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      setSuggestionList(response?.data?.data || []);
    } else {
      setSuggestionList([]);
    }
  };

  useEffect(() => {
    const fetchCounter = async () => {
      const response = await getRequest(CUSTOMER.NOTIFICTIN_COUNT);
      if (response?.data?.success) dispatch(setNotifications(response.data.data));
    };
    fetchCounter();
  }, [accessToken]);

  useEffect(() => {
    const fetchCount = async () => {
      const response = await getRequest(NOTIFICATION.COUNTS);
      if (response?.data?.success) dispatch(setCount(response.data.data?.notificationCount));
    };
    fetchCount();
  }, [accessToken]);

  useEffect(() => {
    if (searchValue.length >= 2) {
      handleCheckSuggestions(`${POST.GET_SUGGESTION}?search=${searchValue}`);
    } else {
      setSuggestionList([]);
    }
  }, [searchValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const insideDesktop = profileDropdownRef.current?.contains(event.target);
      const insideMobile = mobileProfileRef.current?.contains(event.target);
      if (!insideDesktop && !insideMobile) {
        setOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    const handleScroll = () => setOpen(false);
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClear = () => setSearchValue("");
    window.addEventListener("clear-search-input", handleClear);
    return () => window.removeEventListener("clear-search-input", handleClear);
  }, []);

  const isCreateOrUpdate =
    location.pathname === ROUTE.CREATE_POST ||
    location.pathname.startsWith(ROUTE.UPDATE_POST);

  // Search suggestion dropdown (shared)
  const SuggestionDropdown = () =>
    searchOpen && suggestionList?.length > 0 ? (
      <div className="absolute mt-2 w-80 rounded-xl bg-white shadow-lg z-50">
        <div className="p-4">
          <h3 className="font-semibold">{t("popularSearches")}</h3>
        </div>
        <ul>
          {suggestionList.map((item) => (
            <li
              key={item}
              onMouseDown={(e) => { e.preventDefault(); goToProductPage(item); }}
              className="px-4 py-3 text-gray-700 cursor-pointer hover:bg-gray-100 border-t border-gray-100"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    ) : null;

  return (
    <>
      <header className="header bg-white border-b border-gray-200">
        <div className="container">
          <nav className="navigation-wrap flex gap-7 items-center py-2.5 lg:py-6">
            {/* Logo */}
            <div className="item-left">
              <Link to="/"><img src={logo} className="h-12 object-contain" alt="logo" /></Link>
            </div>

            <div className="item-right w-full flex justify-end">
              {!isCreateOrUpdate ? (
                <>
                  {/* â”€â”€ DESKTOP menu (lg+) â”€â”€ */}
                  <div
                    className={`menu-wrap flex w-full justify-between z-30 lg:transform-none transition-all duration-300 ease-in-out lg:static lg:bg-transparent lg:shadow-none lg:h-auto lg:flex-row lg:items-center lg:gap-6 lg:justify-end lg:pt-0 lg:pb-0 pl-7 flex-col bg-white shadow-lg top-0 left-0 h-full ${
                      menuOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0`}
                  >
                    <img src={logo} className="mb-10 lg:hidden h-7" alt="" />

                    {/* Desktop search */}
                    <div
                      className="search-wrap relative w-full hidden lg:block mb-auto lg:w-auto lg:mb-0 lg:me-auto"
                      ref={searchRef}
                    >
                      <div className="rounded-lg px-4 py-3 flex justify-between items-center bg-gray-100">
                        <input
                          type="text"
                          placeholder={t("searchPlaceholder")}
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                          onFocus={() => setSearchOpen(true)}
                          className="w-full focus:outline-none"
                        />
                        <button onClick={() => goToProductPage()} disabled={searchValue.trim() === ""}>
                          <i className="fa-regular fa-magnifying-glass fa-lg" />
                        </button>
                      </div>
                      <SuggestionDropdown />
                    </div>

                    <div className="menu-buttons w-full flex flex-col lg:w-auto lg:flex-row items-center gap-3 lg:gap-6">
                      <div className="relative flex flex-col-reverse lg:block w-full lg:w-auto" ref={profileDropdownRef}>
                        {accessToken ? (
                          /* Logged-in: icon row (desktop only â€” tablet/mobile handled below) */
                          <div className="hidden lg:flex gap-7 items-center px-7">
                            <Link to={ROUTE.NOTIFICATIONS} className="relative">
                              <img src={notification} alt="icon" />
                              {count > 0 && (
                                <p className="absolute -top-1 -right-2 text-[12px] bg-primaryDark text-white rounded-full size-4 flex items-center justify-center">{count}</p>
                              )}
                            </Link>
                            <Link to={ROUTE.WISHLIST} className="relative">
                              <img src={wishlist} alt="icon" />
                              {notifications?.wishlistCount > 0 && (
                                <p className="absolute -top-1 -right-2 text-[12px] bg-primaryDark text-white rounded-full size-4 flex items-center justify-center">{notifications?.wishlistCount}</p>
                              )}
                            </Link>
                            <Link to={ROUTE.MY_ADS}>
                              <img src={ads} alt="icon" />
                            </Link>
                            <div className="cursor-pointer flex items-center gap-2" onClick={() => setOpen(!open)}>
                              <img
                                src={userInfo?.user_profile_url ? `${imagePath}/${userInfo.user_profile_url}` : defaultUser}
                                alt="icon"
                                className="w-14 h-12 object-cover rounded-md border-3 border-blue-100"
                              />
                              <i className="fa-solid fa-angle-down fa-sm" />
                            </div>
                          </div>
                        ) : (
                          /* Logged-out desktop Sign In button â€” dropdown */
                          <button
                            onClick={() => setOpen(!open)}
                            className="font-bold gap-4 items-center px-7 py-3 border-2 border-primary rounded text-primary hover:bg-primary hover:text-white cursor-pointer transition group w-full lg:w-auto hidden lg:flex"
                          >
                            <img src={signin} alt="icon" className="transition group-hover:brightness-0 group-hover:invert" />
                            <p>{t("singIn")}</p>
                            <i className="fa-solid fa-angle-down fa-sm ml-auto" />
                          </button>
                        )}

                        {/* Desktop dropdown */}
                        {open && (
                          <div className="absolute px-4 -right-10 mt-2 w-80 rounded-xl bg-white shadow-lg z-50">
                            <div className="flex items-center gap-3 py-4 border-b border-gray-200">
                              <div className="w-[70px] h-[60px] rounded flex items-center justify-center">
                                <img
                                  src={userInfo?.user_profile_url ? `${imagePath}/${userInfo.user_profile_url}` : defaultUser}
                                  alt="icon"
                                  className="h-full w-full object-cover rounded"
                                />
                              </div>
                              <div>
                                <h3 className="font-bold">{userInfo?.username || t("UserName")}</h3>
                                <p className="text-sm text-gray-500">{userInfo?.email || "example@gmail.com"}</p>
                              </div>
                            </div>
                            <ul className="py-2 mb-1">
                              {userDropDown.map((item, i) => (
                                <li key={i} onClick={() => handleNavigate(item.slug)} className="px-2 py-4 cursor-pointer hover:bg-gray-100 hover:rounded-md border-b border-gray-100">
                                  <div className="flex items-center gap-3">
                                    <img src={item.imgUrl} className="w-6 h-6" alt="icon" /> {item.name}
                                  </div>
                                </li>
                              ))}
                              <li onClick={() => { navigate(ROUTE.HELP_SUPPORT); setOpen(false); }} className="px-2 py-4 cursor-pointer hover:bg-gray-100 hover:rounded-md">
                                <div className="flex items-center gap-3">
                                  <img src={support} className="w-6 h-6" alt="icon" /> {t("helpSupport")}
                                </div>
                              </li>
                            </ul>
                            <div className="border-t border-gray-200 py-2">
                              {accessToken ? (
                                <button onClick={handleLogout} className="flex text-red-700 items-center gap-3 px-2 py-5 w-full hover:bg-gray-100 rounded-md cursor-pointer">
                                  <img src={logoutIcon} className="w-6 h-6" alt="icon" /> {t("logout")}
                                </button>
                              ) : (
                                <button onClick={handleShowLoginModal} className="flex items-center gap-3 px-2 py-5 w-full hover:bg-gray-100 rounded-md cursor-pointer">
                                  <img src={login} className="w-6 h-6" alt="icon" /> {t("login")}
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Mobile slide-in menu content (hamburger menu) */}
                        <div className="lg:hidden">
                          <div className="flex items-center gap-3 py-2 px-2 bg-gray-100 rounded-md mb-2">
                            <div className="w-[50px] h-[40px] rounded flex items-center justify-center">
                              <img
                                src={userInfo?.user_profile_url ? `${imagePath}/${userInfo.user_profile_url}` : defaultUser}
                                alt="icon"
                                className="h-full w-full object-cover rounded"
                              />
                            </div>
                            <div>
                              <h3 className="font-bold">{userInfo?.username || t("UserName")}</h3>
                              <p className="text-xs text-gray-500">{userInfo?.email || "example@gmail.com"}</p>
                            </div>
                          </div>
                          <ul className="py-2 mb-1">
                            {userDropDown.map((item, i) => (
                              <li key={i} onClick={() => { handleNavigate(item.slug); setMenuOpen(false); }} className="px-2 py-2 cursor-pointer hover:bg-gray-100 hover:rounded-md border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                  <img src={item.imgUrl} className="h-4 w-4" alt="icon" /> {item.name}
                                </div>
                              </li>
                            ))}
                            <li onClick={() => { navigate(ROUTE.HELP_SUPPORT); setMenuOpen(false); }} className="px-2 py-2 cursor-pointer hover:bg-gray-100 hover:rounded-md">
                              <div className="flex items-center gap-3">
                                <img src={support} className="h-4 w-4" alt="icon" /> {t("helpSupport")}
                              </div>
                            </li>
                          </ul>
                          <div className="border-t border-gray-200 pt-2">
                            {accessToken ? (
                              <button onClick={handleLogout} className="flex text-red-700 items-center gap-3 px-2 py-3 w-full hover:bg-gray-100 rounded-md cursor-pointer">
                                <img src={logoutIcon} className="h-4 w-4" alt="icon" /> {t("logout")}
                              </button>
                            ) : (
                              <button onClick={handleShowLoginModal} className="flex items-center gap-3 px-2 py-3 w-full hover:bg-gray-100 rounded-md cursor-pointer">
                                <img src={login} className="h-4 w-4" alt="icon" /> {t("login")}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Post Ad button (desktop / hamburger menu) */}
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
                        className="custom-btn w-full lg:w-auto"
                      >
                        <span className="icon w-full lg:w-auto justify-center rounded-sm">
                          <span><i className="fa-solid fa-plus"></i></span> {t("postAdButton")}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* â”€â”€ Mobile / Tablet toolbar (hidden on desktop lg+) â”€â”€ */}
                  <div className="flex items-center gap-3 lg:hidden">
                    {/* Search */}
                    <div className="search-wrap relative" ref={searchRef}>
                      <div className="rounded-lg px-3 py-2 flex justify-between items-center bg-gray-100">
                        <input
                          type="text"
                          placeholder={t("searchButton")}
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                          onFocus={() => setSearchOpen(true)}
                          className="w-full focus:outline-none"
                        />
                        <button onClick={() => goToProductPage()} disabled={searchValue.trim() === ""}>
                          <i className="fa-regular fa-magnifying-glass" />
                        </button>
                      </div>
                      <SuggestionDropdown />
                    </div>

                    {/* Logged in: notification + avatar */}
                    {accessToken && (
                      <>
                        <Link to={ROUTE.NOTIFICATIONS} className="relative flex-shrink-0">
                          <img src={notification} alt="icon" style={{ height: "20px", width: "24px" }} />
                          {count > 0 && (
                            <p className="absolute -top-1 -right-2 text-[12px] bg-primaryDark text-white rounded-full size-4 flex items-center justify-center">{count}</p>
                          )}
                        </Link>
                        <div className="flex-shrink-0 cursor-pointer" onClick={handleMenuToggle}>
                          <img
                            src={userInfo?.user_profile_url ? `${imagePath}/${userInfo.user_profile_url}` : defaultUser}
                            alt="user"
                            className="w-9 h-9 object-cover rounded-md border-2 border-blue-100"
                          />
                        </div>
                      </>
                    )}

                    {/* Logged out: Sign In â†’ dropdown (same as desktop) */}
                    {!accessToken && (
                      <div className="relative flex-shrink-0" ref={mobileProfileRef}>
                        <button
                          onClick={() => setOpen(!open)}
                          className="flex items-center gap-1.5 px-2 sm:px-3 py-2 border-2 border-primary rounded text-primary text-sm font-bold hover:bg-primary hover:text-white transition group"
                        >
                          <img src={signin} alt="icon" className="h-4 w-4 transition group-hover:brightness-0 group-hover:invert" />
                          <span className="hidden sm:inline">{t("singIn")}</span>
                        </button>
                        {open && (
                          <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-lg z-50">
                            <div className="flex items-center gap-3 py-4 px-4 border-b border-gray-200">
                              <div className="w-[50px] h-[40px] rounded flex items-center justify-center">
                                <img
                                  src={userInfo?.user_profile_url ? `${imagePath}/${userInfo.user_profile_url}` : defaultUser}
                                  alt="icon"
                                  className="h-full w-full object-cover rounded"
                                />
                              </div>
                              <div>
                                <h3 className="font-bold">{userInfo?.username || t("UserName")}</h3>
                                <p className="text-sm text-gray-500">{userInfo?.email || "example@gmail.com"}</p>
                              </div>
                            </div>
                            <ul className="py-2 mb-1">
                              {userDropDown.map((item, i) => (
                                <li key={i} onClick={() => handleNavigate(item.slug)} className="px-2 py-3 cursor-pointer hover:bg-gray-100 hover:rounded-md border-b border-gray-100">
                                  <div className="flex items-center gap-3">
                                    <img src={item.imgUrl} className="w-5 h-5" alt="icon" /> {item.name}
                                  </div>
                                </li>
                              ))}
                              <li onClick={() => { navigate(ROUTE.HELP_SUPPORT); setOpen(false); }} className="px-2 py-3 cursor-pointer hover:bg-gray-100 hover:rounded-md">
                                <div className="flex items-center gap-3">
                                  <img src={support} className="w-5 h-5" alt="icon" /> {t("helpSupport")}
                                </div>
                              </li>
                            </ul>
                            <div className="border-t border-gray-200 py-2">
                              <button onClick={handleShowLoginModal} className="flex items-center gap-3 px-2 py-4 w-full hover:bg-gray-100 rounded-md cursor-pointer">
                                <img src={login} className="w-5 h-5" alt="icon" /> {t("login")}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Post Ad */}
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
                      className="custom-btn flex-shrink-0"
                    >
                      <span className="icon justify-center rounded-sm !px-2">
                        <i className="fa-solid fa-plus"></i>
                      </span>
                    </button>

                    {/* Overlay */}
                    <div
                      className={`menu-overlay bg-black/75 z-[21] w-full h-full fixed top-0 left-0 backdrop-blur-xs opacity-0 pointer-events-none transition-all duration-300 ease-in-out ${
                        menuOpen && "opacity-100 !pointer-events-auto cursor-pointer"
                      }`}
                      onClick={handleMenuToggle}
                    />

                    {/* Hamburger */}
                    <div className="hamburger" onClick={handleMenuToggle}>
                      <i className="fa-solid fa-bars fa-lg" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <button onClick={() => navigate(-1)}>
                    <i className="fa-solid fa-xmark-large" />
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      <Catbar allCategory={allCategory} imagePath={imagePath} />

      <LoginModal
        show={showLoginModal}
        hide={() => setShowLoginModal(false)}
        setShowLoginModal={setShowLoginModal}
      />
    </>
  );
};
