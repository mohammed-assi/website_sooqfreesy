import { useTranslation } from "react-i18next";
import { ProductCard } from "../../common/card/ProductCard";
import LoadingButton from "../../common/loadingButton/LoadingButton";
import { useNavigate } from "react-router-dom";
import { ROUTE } from "../../config/constants";
import { ScreenLoader } from "../../utils/screenLoader";
import Pagination from "../../common/pagination";

export const Products = ({
  allPosts,
  imagePath,
  handleLikeUnlikePost,
  setActiveTab,
  activeTab,
  tabs,
  postsLoading,
  totalPages,
  currentPage,
  setCurrentPage,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="spacer-x py-10 md:py-10">
      <div className="w-full">
        <div className="flex">
          {tabs.map((tab) => (
            <p
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative cursor-pointer pb-2 sm:px-4 md:px-10 sm:text-sm md:text-lg font-semibold transition-colors w-full md:w-auto px-2 text-xs text-center ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              {tab.label}
              <span
                className={`absolute left-0 -bottom-[.0625rem] h-[.0625rem] w-full rounded-full transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary h-[.125rem]"
                    : "bg-gray-300"
                }`}
              />
            </p>
          ))}
        </div>

        <div className="pt-8 text-center">
          {postsLoading ? (
            <div className="py-10">
              <ScreenLoader />
            </div>
          ) : allPosts?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allPosts?.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  imagePath={imagePath}
                  handleLikeUnlikePost={handleLikeUnlikePost}
                />
              ))}
            </div>
          ) : activeTab === "forYou" ? (
            <div className="text-center max-w-80 mx-auto pt-10">
              <h5 className="text-3xl mb-2">{t("discoverHeading")}</h5>
              <p className="text-gray-500">{t("discoverDes")}</p>
              <LoadingButton
                onClick={() => navigate(ROUTE.PRODUCT_PAGE)}
                loading={false}
                className="!w-auto mx-auto mt-7 px-10 bg-primary text-white text-base hover:bg-primaryDark h-[56px]"
              >
                {t("discover")}
              </LoadingButton>
            </div>
          ) : activeTab === "nearby" ? (
            <div className="text-center max-w-80 mx-auto pt-10">
              <h5 className="text-3xl mb-2">{t("nearByHeading")}</h5>
            </div>
          ) : (
            <div className="text-center max-w-80 mx-auto pt-10">
              <h5 className="text-3xl mb-2">{t("noDataFound")}</h5>
            </div>
          )}
        </div>

        {allPosts?.length > 0 && activeTab === "worldwide"  && (
          <Pagination
            totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={(page) => {
                const next = Math.max(1, Math.min(totalPages, page));
                setCurrentPage(next);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
          />
        )}
      </div>
    </div>
  );
};
