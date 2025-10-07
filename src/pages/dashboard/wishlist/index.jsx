import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ProductCard } from "../../../common/card/ProductCard";
import { getRequest } from "../../../config/apiFunctions";
import { CUSTOMER, POST } from "../../../config/endPoints";
import { showErrorToast, showSuccessToast } from "../../../utils/toastUtils";
import { ScreenLoader } from "../../../utils/screenLoader";
import { useDispatch, useSelector } from "react-redux";
import { setNotifications } from "../../../redux/slices/notificationSlice";

export const MyWishlist = () => {
  const { t } = useTranslation();
  const imagePath = import.meta.env.VITE_APP_IMAGE_URL;
  const currency = useSelector((state) => state.currency.value);
  const dispatch = useDispatch();
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllPosts = async (url) => {
    setLoading(true);
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      setAllPosts(response?.data?.data?.wishlistItems);
      setLoading(false);
    }
    setLoading(false);
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
        const res = await getRequest(CUSTOMER.NOTIFICTIN_COUNT);
        if (res?.data?.success && res?.data?.statusCode === 200) {
          dispatch(setNotifications(res?.data?.data));
        }
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getAllPostsCallBack();
  }, [currency]);

  return (
    <>
      {loading ? (
        <ScreenLoader />
      ) : (
        <div className="lg:p-5">
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
                {t("noDataFound")}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
