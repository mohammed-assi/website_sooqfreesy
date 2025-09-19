import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ProductCard } from "../../../common/card/ProductCard";
import { getRequest } from "../../../config/apiFunctions";
import { POST } from "../../../config/endPoints";
import { showErrorToast, showSuccessToast } from "../../../utils/toastUtils";

export const MyWishlist = () => {
  const { t } = useTranslation();
  const imagePath = import.meta.env.VITE_APP_IMAGE_URL;
  const [allPosts, setAllPosts] = useState([]);

  const getAllPosts = async (url) => {
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      setAllPosts(response?.data?.data?.wishlistItems);
    }
  };

  const getAllPostsCallBack = () => {
    getAllPosts(`${POST.GET_WISHLIST}`);
  };

  const handleLikeUnlikePost = async (data) => {
    let url;
    if (data?.isWishlisted) {
      url = POST.UNLIKE;
    } else {
      url = POST.LIKE;
    }
    try {
      const response = await getRequest(`${url}?listingId=${data?.id}`);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        showSuccessToast(response?.data?.message);
        getAllPostsCallBack();
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getAllPostsCallBack();
  }, []);

  return (
    <div className="p-5">
      <h1 className="main-heading">{t("wishlist")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
        {allPosts?.length > 0 ? (
          allPosts.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              imagePath={imagePath}
              handleLikeUnlikePost={handleLikeUnlikePost}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 font-medium py-6">
            {t('noDataFound')}
          </p>
        )}
      </div>
    </div>
  );
};
