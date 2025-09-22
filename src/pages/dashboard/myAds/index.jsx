import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ProductListCard from "../../../components/searchPage/ProductListCard";
import { getRequest } from "../../../config/apiFunctions";
import { POST } from "../../../config/endPoints";
import { ScreenLoader } from "../../../utils/screenLoader";

export const MyAds = () => {
  const { t } = useTranslation();
  const tabs = [
    { id: 1, label: t("active") },
    { id: 3, label: t("sold") },
    { id: 2, label: t("reject") },
  ];
  const [activeTab, setActiveTab] = useState(1);
  const imagePath = import.meta.env.VITE_APP_IMAGE_URL;
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllPosts = async (url) => {
    setLoading(true);
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      setAllPosts(response?.data?.data?.posts);
      setLoading(false);
    }
    setLoading(false);
  };

  const getAllPostsCallBack = () => {
    getAllPosts(`${POST.GET_MYADS}?status=${activeTab}`);
  };

  useEffect(() => {
    getAllPostsCallBack();
  }, [activeTab]);

  return (
    <>
      {loading ? (
        <ScreenLoader />
      ) : (
        <div className="p-5">
          <h1 className="main-heading">{t("myAds")}</h1>

          <div className="flex py-8">
            {tabs.map((tab) => (
              <p
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative cursor-pointer pb-2 px-10 text-lg font-semibold  transition-colors ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                {tab.label}
                <span
                  className={`absolute left-0 -bottom-[1px] h-[1px] w-full rounded-full transition-colors ${
                    activeTab === tab.id ? "bg-primary h-[2px]" : "bg-gray-300"
                  }`}
                />
              </p>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {allPosts?.length > 0 ? (
              allPosts.map((item) => (
                <ProductListCard
                  key={item.id}
                  item={item}
                  imagePath={imagePath}
                  showWishlist={false}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 font-medium py-6">
                {t("noDataFound")}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
