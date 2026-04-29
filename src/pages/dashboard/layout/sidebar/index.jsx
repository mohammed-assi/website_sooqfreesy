import React, { useEffect, useState } from "react";
import profile from "../../../../assets/icon/profile.svg";
import ads from "../../../../assets/icon/ads.svg";
import wishlist from "../../../../assets/icon/wishlist.svg";
import notification from "../../../../assets/icon/notification.svg";
import { ROUTE } from "../../../../config/constants";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Sidebar = ({ ...props }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("Profile");

  const { i18n } = useTranslation();


  const menuItems = [
    {
      value: "Profile",
      name: t('profile'),
      icon: profile,
      slug: ROUTE.USER_PROFILE,
    },
    { value: "My Ads", name: t('myAds'), icon: ads, slug: ROUTE.MY_ADS },
    {
      value: "Wishlist",
      name: t('wishlist'),
      icon: wishlist,
      slug: ROUTE.WISHLIST,
    },
    {
      value: "Notification",
      name: t("notification"),
      icon: notification,
      slug: ROUTE.NOTIFICATIONS,
    },
  ];

  useEffect(() => {
    const current = menuItems.find((item) => item.slug === location.pathname);
    if (current) {
      setActive(current.value);
    }
  }, [location.pathname]);

  return (
    <aside
      className={`hidden lg:block w-64 shadow-md h-full lg:h-[calc(100vh-110px)] fixed pt-6 z-10 bg-white transition-transform duration-200 ease-in-out
    ${i18n.language === "ar" ? "top-[100px] right-0" : "top-[100px] left-0"}
    ${i18n.language === "ar"
          ? props.openSideBar
            ? "translate-x-0"
            : "translate-x-full"
          : props.openSideBar
            ? "translate-x-0"
            : "-translate-x-full"
        }
    lg:sticky lg:top-[120px] lg:translate-x-0 lg:left-0 lg:right-auto
  `}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <nav className="flex flex-col">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => {
              setActive(item.value);
              navigate(item.slug);
              props.setOpenSideBar(false);
            }}
            className={`flex items-center gap-3 px-5 py-4 font-medium transition ${i18n.language === "ar" ? "text-right" : "text-left"
              } ${active === item.value
                ? `${i18n.language === "ar"
                  ? "bg-cyan-100 border-r-5 border-primary text-black"
                  : "bg-cyan-100 border-l-5 border-primary text-black"
                }`
                : "hover:bg-gray-100 text-gray-700"
              }`}
          >
            {/* Icon position flip for RTL if needed */}
            {i18n.language === "ar" ? (
              <>
                <span className="text-lg">
                  <img src={item.icon} alt="icon" />
                </span>
                <span className="flex-1">{item.name}</span>
              </>
            ) : (
              <>
                <span className="text-lg">
                  <img src={item.icon} alt="icon" />
                </span>
                <span className="flex-1">{item.name}</span>
              </>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
