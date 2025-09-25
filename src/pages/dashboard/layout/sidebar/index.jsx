import React, { useEffect, useState } from "react";
import profile from "../../../../assets/icon/profile.svg";
import ads from "../../../../assets/icon/ads.svg";
import wishlist from "../../../../assets/icon/wishlist.svg";
import notification from "../../../../assets/icon/notification.svg";
import { ROUTE } from "../../../../config/constants";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Sidebar = ({...props}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("Profile");

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
    <aside className="w-64 shadow-md h-full lg:h-[calc(100vh-110px)] fixed top-[100px] lg:sticky lg:top-[120px] pt-6 z-10 bg-white transform lg:transform-none -translate-x-full lg:translate-x-0 transition-transform" {...props}>
      <nav className="flex flex-col">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => {
              setActive(item.value);
              navigate(item.slug);
            }}
            className={`flex items-center gap-3 px-5 py-4 text-left font-medium transition 
              ${active === item.value
                ? "bg-cyan-100 border-l-5 border-primary text-black"
                : "hover:bg-gray-100 text-gray-700"
              }`}
          >
            <span className="text-lg">
              <img src={item.icon} alt="icon" />
            </span>
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
