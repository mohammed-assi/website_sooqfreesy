import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ProductCard } from "../../common/card/ProductCard";

export const Products = ({ allPosts, imagePath, handleLikeUnlikePost }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("forYou");

  const tabs = [
    { id: "forYou", label: t("forYou") },
    { id: "nearby", label: t("nearby") },
    { id: "worldwide", label: t("worldwide") },
  ];

  return (
    <div className="spacer-x py-20">
      <div className="w-full">
        <div className="flex">
          {tabs.map((tab) => (
            <p
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative cursor-pointer pb-2 px-4 md:px-10 text-sm md:text-lg font-semibold transition-colors ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              {tab.label}
              <span
                className={`absolute left-0 -bottom-[.0625rem] h-[.0625rem] w-full rounded-full transition-colors ${
                  activeTab === tab.id ? "bg-primary h-[.125rem]" : "bg-gray-300"
                }`}
              />
            </p>
          ))}
        </div>

        <div className="pt-8 text-center">
          {(activeTab === "forYou" ||
            activeTab === "nearby" ||
            activeTab === "worldwide") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allPosts?.length > 0 ? (
                allPosts?.map((item) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    imagePath={imagePath}
                    handleLikeUnlikePost={handleLikeUnlikePost}
                  />
                ))
              ) : (
                <p>{t("noDataFound")}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="pt-12">
        <h3 className="main-heading">{t("welcomeSyria")}</h3>
        <p className="text-gray-500">{t("welcomeSyriaIntro")}</p>
      </div>
    </div>
  );
};
