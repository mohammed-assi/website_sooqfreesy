import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import eyeIcon from "../../assets/icon/eye.svg";
import shareIcon from "../../assets/icon/share.svg";
import heart from "../../assets/icon/wishlist.svg";
import heartFilled from "../../assets/icon/heartFilled.svg";
import location from "../../assets/icon/silverLocation.svg";
import darkLocation from "../../assets/icon/darkLocation.svg";
import primaryBell from "../../assets/icon/primaryBell.svg";
import bed from "../../assets/icon/bed.svg";
import sofa from "../../assets/icon/sofa.svg";
import pool from "../../assets/icon/pool.svg";
import area from "../../assets/icon/area.svg";
import floor from "../../assets/icon/floor.svg";
import calendar from "../../assets/icon/calendar.svg";
import report from "../../assets/icon/report.svg";
import whitestar from "../../assets/icon/whitestar.svg";
import defaultUser from "../../assets/icon/defaultUser.svg";
import headerContact from "../../assets/icon/headerContact.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { ProductCard } from "../../common/card/ProductCard";
import { AddReviewModal } from "../../components/productDetails/AddReviewModal";
import RatingStar from "../../common/ratingStar/RatingStar";
import { Link, useParams } from "react-router-dom";
import { ROUTE } from "../../config/constants";
import { InfoModal } from "../../common/modal/InfoModal";
import { ReportListModal } from "../../components/productDetails/ReportListModal";
import { getRequest } from "../../config/apiFunctions";
import { POST } from "../../config/endPoints";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import { useSelector } from "react-redux";
import LoginModal from "../../components/auth/LoginModal";
import moment from "moment/moment";
import { ShareModal } from "../../components/productDetails/ShareModal";

export const ProductDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const imagePath = import.meta.env.VITE_APP_IMAGE_URL;
  const GOOGLE_API_KEY = import.meta.env.VITE_APP_GOOGLE_API_KEY;
  const { accessToken } = useSelector((state) => state.auth);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [showReportListModal, setShowReportListModal] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [postDetailData, setPostDetailData] = useState({});
  const [showShareModal, setShowShareModal] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_API_KEY,
  });

  const getAllPosts = async (url) => {
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      setAllPosts(response?.data?.data?.posts);
    }
  };

  const getAllPostsCallBack = () => {
    getAllPosts(`${POST.GET_ALL}?page=${1}&limit=8`);
  };

  const getPostDeatils = async (url) => {
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      setPostDetailData(response?.data?.data?.post);
    }
  };

  const getPostDeatilsCallBack = () => {
    getPostDeatils(`${POST.GET_DETAILS}/${id}`);
  };

  const handleLikeUnlikePost = async (data) => {
    if (accessToken) {
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
          getPostDeatilsCallBack();
        }
      } catch (error) {
        showErrorToast(error?.response?.data?.message);
      }
    } else {
      setShowLoginModal(true);
    }
  };

  useEffect(() => {
    getPostDeatilsCallBack();
  }, [id]);

  useEffect(() => {
    getAllPostsCallBack();
  }, [accessToken]);

  console.log("postDetailData", postDetailData);

  return (
    <div className="spacer-x">
      <div className="pt-15">
        <div className="text-sm text-gray-500 mb-2">
          {t("home")} <span className="mx-1">{">"}</span> {t("productDetails")}
        </div>

        <h1 className="main-heading">{postDetailData?.title}</h1>

        <div className="py-6 overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-2/3 w-full">
            <Swiper
              style={{
                "--swiper-navigation-color": "#00b4d8",
                "--swiper-pagination-color": "#00b4d8",
              }}
              loop={true}
              spaceBetween={10}
              slidesPerView={1}
              centeredSlides={true}
              navigation={true}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper2 h-100"
            >
              {postDetailData?.images?.map((item, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={`${imagePath}/${item.image_url}`}
                    alt={`Nature ${i + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <Swiper
              onSwiper={setThumbsSwiper}
              loop={true}
              spaceBetween={10}
              slidesPerView={5}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper h-40  mt-4 flex items-center"
            >
              {postDetailData?.images?.map((item, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={`${imagePath}/${item.image_url}`}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover cursor-pointer rounded-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="lg:w-1/3 w-full ps-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-md rounded-full px-3 py-1 font-semibold bg-gray-200">
                Listing ID: 123456789
              </span>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-1 text-sm">
                  <img src={eyeIcon} alt="icon" />
                  {postDetailData?.views}
                </div>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-1 text-sm"
                >
                  <img src={shareIcon} alt="icon" />
                </button>
                <button
                  onClick={() => handleLikeUnlikePost(postDetailData)}
                  className="flex items-center gap-1 text-sm"
                >
                  {postDetailData?.isWishlisted ? (
                    <img src={heartFilled} alt="icon" />
                  ) : (
                    <img src={heart} alt="icon" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <h2 className="main-heading text-primary">
                £{postDetailData?.price}
              </h2>
              <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">
                {postDetailData?.subCategoryName}
              </span>
            </div>

            <p className="text-sm text-gray-700">
              {postDetailData?.description}
            </p>

            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <img src={location} alt="icon" />
              {postDetailData?.nearby_location}
            </div>

            <button
              onClick={() => setShowNotifyModal(true)}
              className="w-full p-3 font-bold text-primary underline rounded-lg flex items-center justify-center gap-2 bg-gray-200"
            >
              <img src={primaryBell} alt="icon" /> {t("priceDrops")}
            </button>

            <div className="grid grid-cols-3 gap-3 text-sm text-gray-700">
              <div className="flex flex-col items-center justify-center gap-2 bg-gray-200 rounded-lg py-2">
                <img src={bed} alt="icon" /> 3 Bedrooms
              </div>
              <div className="flex flex-col items-center justify-center gap-2 bg-gray-200 rounded-lg py-2">
                <img src={sofa} alt="icon" />
                Furnished
              </div>
              <div className="flex flex-col items-center justify-center gap-2 bg-gray-200 rounded-lg py-2">
                <img src={pool} alt="icon" /> Pool
              </div>
              <div className="flex flex-col items-center justify-center gap-2 bg-gray-200 rounded-lg py-2">
                <img src={area} alt="icon" />
                214 m2 area
              </div>
              <div className="flex flex-col items-center justify-center gap-2 bg-gray-200 rounded-lg py-2">
                <img src={floor} alt="icon" />
                2nd Floor
              </div>
              <div className="flex flex-col items-center justify-center gap-2 bg-gray-200 rounded-lg py-2">
                <img src={calendar} alt="icon" />
                Post: 16/02/2025
              </div>
            </div>

            <button
              onClick={() => setShowReportListModal(true)}
              className="w-full p-3 font-bold text-red-600 rounded-lg flex items-center justify-center gap-2 bg-gray-200"
            >
              <img src={report} alt="icon" /> {t("reportListing")}
            </button>
          </div>
        </div>

        <div className="py-6 overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-2/3 w-full">
            <h3 className="font-bold text-xl">{t("description")}</h3>
            <p className="text-gray-600 py-2">{postDetailData?.description}</p>
          </div>
          <div className="lg:w-1/3 w-full ps-5 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <img src={darkLocation} alt="icon" />
                <h3 className="font-bold text-xl">
                  {postDetailData?.nearby_location}
                </h3>
              </div>
              <div className="w-full h-70 py-2 rounded-lg overflow-hidden shadow">
                {!isLoaded ? (
                  <p>Loading map...</p>
                ) : (
                  <GoogleMap
                    center={{
                      lat: postDetailData.latitude,
                      lng: postDetailData.longitude,
                    }}
                    zoom={14}
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                  >
                    <Marker
                      position={{
                        lat: postDetailData.latitude,
                        lng: postDetailData.longitude,
                      }}
                    />
                  </GoogleMap>
                )}
              </div>
            </div>

            <div className="py-4">
              <h3 className="font-bold text-xl">{t("postOwner")}</h3>
              <div className="flex items-center gap-3 py-2">
                <div className="w-40 h-40 flex items-center justify-center">
                  <img
                    src={
                      postDetailData?.user?.user_profile_url
                        ? `${imagePath}/${postDetailData?.user?.user_profile_url}`
                        : defaultUser
                    }
                    alt="icon"
                    className="h-full w-full rounded-lg object-cover"
                  />
                </div>
                <Link
                  to={`${ROUTE.SELLER_PROFILE}/${postDetailData?.user?.userid}`}
                >
                  <h3 className="text-xl font-bold">
                    {postDetailData?.user?.username}
                  </h3>
                  <RatingStar starValue={4.5} />
                  <p className="text-sm text-gray-500 py-2">
                    {t("memberSince")}{" "}
                    {moment(postDetailData?.user?.created_at).format(
                      "MM/DD/yyyy"
                    )}
                  </p>
                </Link>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() =>
                    (window.location.href = `tel:${postDetailData?.user?.phone}`)
                  }
                  className="flex gap-2 font-bold items-center px-6 py-3 bg-primary rounded-lg text-white hover:bg-primaryDark cursor-pointer transition"
                >
                  <img src={headerContact} alt="icon" className="h-5 w-5" />{" "}
                  {postDetailData?.user?.phone}
                </button>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="flex gap-1 font-bold items-center px-6 py-3 bg-primary rounded-lg text-white hover:bg-primaryDark cursor-pointer transition"
                >
                  <img src={whitestar} alt="icon" className="h-5 w-5" />{" "}
                  {t("addReviewsButton")}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-8">
          <div className="flex justify-between items-center pb-4">
            <h2 className="main-heading">{t("similarPosts")}</h2>
            <Link to={ROUTE.PRODUCT_PAGE}>
              <h2 className="font-bold text-md">{t("viewAll")}</h2>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allPosts?.map((car) => (
              <ProductCard
                key={car.id}
                item={car}
                imagePath={imagePath}
                handleLikeUnlikePost={handleLikeUnlikePost}
              />
            ))}
          </div>
        </div>
      </div>

      {showReviewModal && (
        <AddReviewModal
          onClose={() => setShowReviewModal(false)}
          postDetailData={postDetailData}
        />
      )}

      {showNotifyModal && (
        <InfoModal
          onClose={() => setShowNotifyModal(false)}
          title={t("requestSubmitted")}
          subtitle={t("successfullySubmitted")}
        />
      )}
      {showReportListModal && (
        <ReportListModal onClose={() => setShowReportListModal(false)} />
      )}

      {showShareModal && (
        <ShareModal onClose={() => setShowShareModal(false)} />
      )}

      <LoginModal
        show={showLoginModal}
        hide={() => setShowLoginModal(false)}
        setShowLoginModal={setShowLoginModal}
      />
    </div>
  );
};
