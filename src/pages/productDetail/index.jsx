import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import eyeIcon from "../../assets/icon/eye.svg";
import shareIcon from "../../assets/icon/share.svg";
import heart from "../../assets/icon/wishlist.svg";
import heartFilled from "../../assets/icon/heartFilled.svg";
import locationicon from "../../assets/icon/silverLocation.svg";
import darkLocation from "../../assets/icon/darkLocation.svg";
// import primaryBell from "../../assets/icon/primaryBell.svg";
import report from "../../assets/icon/report.svg";
import whitestar from "../../assets/icon/whitestar.svg";
// import whitebell from "../../assets/icon/whitebell.svg";
// import whitecheck from "../../assets/icon/whitecheck.svg";
import defaultUser from "../../assets/icon/defaultUser.svg";
import headerContact from "../../assets/icon/headerContact.svg";
import whatsapp from "../../assets/icon/whatsapp.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { ProductCard } from "../../common/card/ProductCard";
import { AddReviewModal } from "../../components/productDetails/AddReviewModal";
import RatingStar from "../../common/ratingStar/RatingStar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LOCAL_STORAGE, ROUTE } from "../../config/constants";
import { InfoModal } from "../../common/modal/InfoModal";
import { ReportListModal } from "../../components/productDetails/ReportListModal";
import { getRequest } from "../../config/apiFunctions";
import { CUSTOMER, POST, REPORT_LIST } from "../../config/endPoints";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "../../utils/toastUtils";
import { useDispatch, useSelector } from "react-redux";
import LoginModal from "../../components/auth/LoginModal";
import moment from "moment/moment";
import { ShareModal } from "../../components/productDetails/ShareModal";
import { ScreenLoader } from "../../utils/screenLoader";
import NotFoundPage from "../notFoundPage";
import { setNotifications } from "../../redux/slices/notificationSlice";

export const ProductDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const imagePath = import.meta.env.VITE_APP_IMAGE_URL;
  const GOOGLE_API_KEY = import.meta.env.VITE_APP_GOOGLE_API_KEY;
  const { accessToken } = useSelector((state) => state.auth);
  const { userInfo } = useSelector((state) => state.user);
  const currency = useSelector((state) => state.currency.value);
  const reduxCoords = useSelector((state) => state.location.coords);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  // const [notified, setNotified] = useState(false);
  const [showReportListModal, setShowReportListModal] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [postDetailData, setPostDetailData] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [reportList, setReportList] = useState("");

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_API_KEY,
  });

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
    let filters = {};
    if (reduxCoords?.country) {
      filters = { country: reduxCoords?.country };
    }
    const queryString = Object.keys(filters).length
      ? `&filters=${encodeURIComponent(JSON.stringify(filters))}`
      : "";
    getAllPosts(
      `${POST.GET_SIMILAR_POST}/${
        postDetailData?.id
      }?page=${1}&limit=8${queryString}`,
    );
  };

  const getPostDeatils = async (url) => {
    // setLoading(true);
    // const response = await getRequest(url);
    // if (response?.data?.success && response?.data?.statusCode === 200) {
    //   setPostDetailData(response?.data?.data?.post);
    //   setLoading(false);
    // } else {
    //   setPostDetailData(null);
    // }
    // setLoading(false);
    setLoading(true);
    try {
      const response = await getRequest(url);

      if (response?.data?.success && response?.data?.statusCode === 200) {
        setPostDetailData(response?.data?.data?.post);
      } else {
        setPostDetailData(null);
      }
    } catch (error) {
      console.log(error);
      setPostDetailData(null);
    } finally {
      setLoading(false);
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
          const res = await getRequest(CUSTOMER.NOTIFICTIN_COUNT);
          if (res?.data?.success && res?.data?.statusCode === 200) {
            dispatch(setNotifications(res?.data?.data));
          }
        }
      } catch (error) {
        showErrorToast(error?.response?.data?.message);
      }
    } else {
      setShowLoginModal(true);
    }
  };

  const getContactReportList = async (url) => {
    try {
      const response = await getRequest(url);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setReportList(response?.data?.data);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getContactReportList(`${REPORT_LIST.CONTACT_US}?reportType=POST`);
  }, []);

  useEffect(() => {
    if (id) {
      getPostDeatilsCallBack();
      const existing =
        JSON.parse(localStorage.getItem(LOCAL_STORAGE.RECENT_VIEWS)) || [];
      const currentId = Number(id);
      const filtered = existing.filter((item) => item !== currentId);
      filtered.push(currentId);
      const limited = filtered.slice(-8);
      localStorage.setItem(LOCAL_STORAGE.RECENT_VIEWS, JSON.stringify(limited));
    }
  }, [id, currency]);

  useEffect(() => {
    if (postDetailData?.id) {
      getAllPostsCallBack();
    }
  }, [postDetailData, currency]);

  // useEffect(() => {
  //   setShareLink(postDetailData?.webLink);
  // }, [postDetailData]);

  if (loading) return <ScreenLoader />;
  if (!postDetailData && !loading) return <NotFoundPage />;

  return (
    <>
      <div className="spacer-x">
        <div className="pt-10 md:pt-15">
          <div className="text-sm text-gray-500 mb-2">
            <Link className="hover:text-primary" to={ROUTE.ROOT}>
              {t("home")}
            </Link>{" "}
            <span className="mx-1">{">"}</span> {t("productDetails")}
          </div>

          <h1 className="main-heading">{postDetailData?.title}</h1>

          <div className="py-6 overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-2/3 w-full">
              {postDetailData?.images?.length > 0 ? (
                <>
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
                    thumbs={{
                      swiper:
                        thumbsSwiper && !thumbsSwiper.destroyed
                          ? thumbsSwiper
                          : null,
                    }}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mySwiper2 h-100"
                  >
                    {postDetailData.images.map((item, i) => (
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
                    breakpoints={{
                      0: {
                        slidesPerView: 3.4,
                      },
                      767: {
                        slidesPerView: 4.4,
                      },
                      1024: {
                        slidesPerView: 5,
                      },
                    }}
                    className="mySwiper mt-4 flex items-center"
                  >
                    {postDetailData.images.map((item, i) => (
                      <SwiperSlide key={i}>
                        <img
                          src={`${imagePath}/${item.image_url}`}
                          alt={`Thumbnail ${i + 1}`}
                          className="w-full object-cover cursor-pointer rounded-lg aspect-square lg:aspect-auto lg:h-[110px]"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </>
              ) : (
                <>
                  <div className="w-full h-100 flex items-center justify-center bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg">
                    <span className="text-gray-500 text-sm">
                      {t("noImages")}
                    </span>
                  </div>
                </>
              )}
              <div className="mt-10 w-full">
                <h3 className="font-bold text-xl">{t("description")}</h3>
                <p className="text-gray-600 py-2">
                  {postDetailData?.description}
                </p>
              </div>

              {postDetailData?.timeline?.length > 0 && (
                <div className="mt-10 w-full">
                  <h3 className="font-bold text-xl text-red-500 pb-2">
                    {t("rejectAt")}
                  </h3>
                  {postDetailData?.timeline?.map((item, i) => (
                    <p key={i} className="text-gray-600">
                      {item?.text}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:w-1/3 w-full lg:ps-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold bg-gray-100 px-6 py-1 rounded-full">
                  {t("listingId")}: {postDetailData?.id}
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

              <div className="flex items-center justify-end">
                <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">
                  {postDetailData?.subCategoryName}
                </span>
              </div>

              <h2 className="main-heading text-primary">
                {/* {currency === "SYP" ? "SYP" : "$"}{" "}
                  {postDetailData?.currencyTypePrice} */}
                <span dir="ltr" className="inline-block">
                  <span className="mr-1">
                    {currency === "SYP" ? "SYP" : "$"}
                  </span>
                  <span>{postDetailData?.currencyTypePrice}</span>
                </span>
              </h2>

              <p className="text-sm text-gray-700">{postDetailData?.title}</p>

              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <img src={locationicon} alt="icon" />
                {postDetailData?.nearby_location}
              </div>

              {/* <button
                onClick={() => {
                  if (accessToken) {
                    setShowNotifyModal(true);
                    setNotified(true);
                  } else {
                    setShowLoginModal(true);
                  }
                }}
                disabled={
                  postDetailData?.user?.userid === userInfo?.id || notified
                }
                className={`w-full p-3 font-bold underline rounded-lg flex items-center justify-center gap-2  ${
                  notified
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-primary"
                }`}
              >
                <img src={notified ? whitebell : primaryBell} alt="icon" />{" "}
                {t("priceDrops")}{" "}
                {notified && <img src={whitecheck} alt="icon" />}
              </button> */}

              <div className="grid grid-cols-3 gap-3 text-sm text-gray-700">
                {postDetailData?.content &&
                  Object.entries(postDetailData?.content)?.map(
                    ([key, value]) => (
                      <div className="flex flex-col text-center items-center min-h-20 justify-center bg-gray-200 rounded-lg py-2 capitalize">
                        <span className="font-semibold leading-none pb-2">
                          {key}
                        </span>
                        {value}
                      </div>
                    ),
                  )}
                <div className="flex flex-col text-center items-center min-h-20 justify-center bg-gray-200 rounded-lg py-2 capitalize">
                  <span className="font-semibold leading-none pb-2">
                    {t("location")}
                  </span>
                  {postDetailData?.country}
                </div>
                <div className="flex flex-col text-center items-center min-h-20 justify-center bg-gray-200 rounded-lg py-2 capitalize">
                  <span className="font-semibold leading-none pb-2">
                    {t("userType")}
                  </span>
                  {postDetailData?.user_type.toLowerCase()}
                </div>
                <div className="flex flex-col text-center items-center min-h-20 justify-center bg-gray-200 rounded-lg py-2 capitalize">
                  <span className="font-semibold leading-none pb-2">
                    {t("post")}
                  </span>
                  {moment(postDetailData?.created_at).format("MM/DD/yyyy")}
                </div>
              </div>

              <button
                onClick={() => {
                  if (postDetailData?.user?.userid === userInfo?.id) {
                    showInfoToast(t("reportOwn"));
                  } else if (accessToken) {
                    setShowReportListModal(true);
                  } else {
                    setShowLoginModal(true);
                  }
                }}
                className="w-full p-3 font-bold text-red-600 rounded-lg flex items-center justify-center gap-2 bg-gray-200"
              >
                <img src={report} alt="icon" /> {t("reportListing")}
              </button>

              <div className="w-full mt-10 space-y-4">
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
                        center={
                          postDetailData?.latitude && postDetailData?.longitude
                            ? {
                                lat: Number(postDetailData?.latitude),
                                lng: Number(postDetailData?.longitude),
                              }
                            : { lat: 0, lng: 0 }
                        }
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
                  {postDetailData?.post_type === "SALE" && (
                    <h3 className="font-bold text-xl">
                      {postDetailData?.user_type === "AGENT"
                        ? t("agent")
                        : t("owner")}
                    </h3>
                  )}
                  {postDetailData?.post_type === "RENT" && (
                    <h3 className="font-bold text-xl">
                      {postDetailData?.user_type === "AGENT"
                        ? t("agent")
                        : t("landlord")}
                    </h3>
                  )}
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
                    <div>
                      <h3 className="text-xl font-bold">
                        {postDetailData?.user?.username}
                      </h3>
                      <div className="flex gap-2">
                        <RatingStar
                          starValue={postDetailData?.user?.averageRating}
                        />{" "}
                        <p>
                          (
                          {Number(postDetailData?.user?.averageRating).toFixed(
                            1,
                          )}
                          )
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 py-2">
                        {t("memberSince")}{" "}
                        {moment(postDetailData?.user?.created_at).format(
                          "MM/DD/yyyy",
                        )}
                      </p>
                      <p
                        onClick={() => {
                          if (postDetailData?.user?.userid !== userInfo?.id) {
                            navigate(
                              `${ROUTE.SELLER_PROFILE}/${postDetailData?.user?.userid}`,
                            );
                          }
                        }}
                        className="text-sm text-gray-500 underline hover:text-primary cursor-pointer"
                      >
                        {t("viewProfile")}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button
                    onClick={() => {
                    const phone = postDetailData?.user?.phone;

                    if (!phone) return;

                    // remove spaces and + if exists
                    const cleanPhone = phone.replace(/\s+/g, "").replace("+", "");

                    const message = encodeURIComponent("Hello, I am interested in your listing.");

                    window.open(
                      `https://wa.me/${cleanPhone}?text=${message}`,
                      "_blank"
                    );
                  }}
                      // onClick={() =>
                      //   (window.location.href = `tel:${postDetailData?.user?.phone}`)
                      // }
                      className="flex gap-2 font-bold items-center px-6 py-3 bg-green-500 rounded-lg text-white hover:bg-primaryDark cursor-pointer transition"
                    >
                      <img  src={whatsapp}  alt="whatsapp icon"  className="h-5 w-5 filter brightness-0 invert"/>
                      {postDetailData?.user?.phone || "7777777777"}
                    </button>
                    <button
                      onClick={() => {
                        if (postDetailData?.user?.userid === userInfo?.id) {
                          showInfoToast(t("cantReview"));
                        } else if (accessToken) {
                          setShowReviewModal(true);
                        } else {
                          setShowLoginModal(true);
                        }
                      }}
                      className="flex gap-1 font-bold items-center px-6 py-3 bg-primary rounded-lg text-white hover:bg-primaryDark cursor-pointer transition"
                    >
                      <img src={whitestar} alt="icon" className="h-5 w-5" />{" "}
                      {t("addReviewsButton")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pb-8">
            <div className="flex justify-between items-center pb-4">
              <h2 className="main-heading">{t("similarPosts")}</h2>

              <h2
                onClick={() => {
                  navigate(ROUTE.PRODUCT_PAGE, {
                    state: { subCatId: postDetailData?.sub_category_id },
                  });
                }}
                className="font-bold text-md cursor-pointer"
              >
                {t("viewAll")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <p className="col-span-full text-center text-gray-500 font-medium py-6">
                  {t("noDataFound")}
                </p>
              )}
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
          <ReportListModal
            onClose={() => setShowReportListModal(false)}
            reportList={reportList}
            postDetailData={postDetailData}
          />
        )}

        {showShareModal && (
          <ShareModal
            onClose={() => setShowShareModal(false)}
            shareLink={postDetailData?.webLink}
            title={postDetailData?.title}
            description={postDetailData?.description}
            image={`${imagePath}/${postDetailData?.images[0]?.image_url}`}
            price={postDetailData?.currencyTypePrice}
            currency={currency}
          />
        )}

        <LoginModal
          show={showLoginModal}
          hide={() => setShowLoginModal(false)}
          setShowLoginModal={setShowLoginModal}
        />
      </div>
    </>
  );
};
