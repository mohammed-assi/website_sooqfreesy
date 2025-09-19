import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import defaultUser from "../../assets/icon/defaultUser.svg";
import RatingStar from "../../common/ratingStar/RatingStar";
import headerContact from "../../assets/icon/headerContact.svg";
import menu from "../../assets/icon/menu.svg";
import reportUser from "../../assets/icon/reportUser.svg";
import ReportListModal from "../../components/sellerProfile/ReportListModal";
import { ListingFilter } from "../../components/sellerProfile/ListingFilter";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import { getRequest, postRequest } from "../../config/apiFunctions";
import { CUSTOMER, POST, REPORT_LIST } from "../../config/endPoints";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginModal from "../../components/auth/LoginModal";
import { ScreenLoader } from "../../utils/screenLoader";

export const SellerProfile = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const imagePath = import.meta.env.VITE_APP_IMAGE_URL;
  const { accessToken } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [showReportButton, setShowReportButton] = useState(false);
  const [showReportListModal, setShowReportListModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [sellerProfile, setSellerProfile] = useState({});
  const [sellerReviews, setSellerReviews] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [modalFilter, setModalFilter] = useState({});
  const [reportList, setReportList] = useState([]);
  const [reportId, setReportId] = useState(null);
  const [customReason, setCustomReason] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    location: "",
    type: "",
    category: "",
    priceRange: [0, 0],
  });

  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getAllPosts = async (url) => {
    setLoading(true);
    try {
      const response = await getRequest(url);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setAllPosts(response?.data?.data?.posts);
        // setTotalCounts(response?.data?.data?.totalCount);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setLoading(false);
    }
    setLoading(false);
  };

  const getAllPostsCallBack = () => {
    const filterObj = {};

    if (filters.category) filterObj.category_id = Number(filters.category);
    if (filters.priceRange?.[0]) filterObj.price_min = filters.priceRange[0];
    if (filters.priceRange?.[1]) filterObj.price_max = filters.priceRange[1];
    if (filters.city) filterObj.city = filters.city;
    if (filters.type) filterObj.post_type = filters.type;

    let url = `${POST.SELLER_POST}/${id}`;

    if (Object.keys(filterObj).length > 0) {
      url += `?filters=${encodeURIComponent(JSON.stringify(filterObj))}`;
    }

    getAllPosts(url);
  };

  const getAllCategory = async (url) => {
    try {
      const response = await getRequest(url);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setAllCategory(response?.data?.data?.categories);
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  const getSellerProfile = async (url) => {
    setLoading(true);
    try {
      const response = await getRequest(url);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setSellerProfile(response?.data?.data);
        setLoading(false);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
    setLoading(false);
  };

  const getSellerReview = async (url) => {
    setLoading(true);
    try {
      const response = await getRequest(url);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setSellerReviews(response?.data?.data);
        setLoading(false);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
    setLoading(false);
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

  const handleSubmitSellerReport = async () => {
    if (reportId === null) {
      showErrorToast(t("reportReason"));
    } else {
      const payload = {
        seller_id: sellerProfile?.id,
        reportListing_id: reportId,
        reason: customReason,
      };

      try {
        const response = await postRequest(REPORT_LIST.REPORT_SELLER, payload);
        if (response?.data?.success && response?.data?.statusCode === 200) {
          showSuccessToast(response?.data?.message);
          setShowReportButton(false);
          setShowReportListModal(false);
          setReportId(null);
          setCustomReason("");
        }
      } catch (error) {
        showErrorToast(error?.response?.data?.message);
      }
    }
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
        }
      } catch (error) {
        showErrorToast(error?.response?.data?.message);
      }
    } else {
      setShowLoginModal(true);
    }
  };

  useEffect(() => {
    getContactReportList(`${REPORT_LIST.CONTACT_US}?reportType=SELLER`);
  }, []);

  useEffect(() => {
    getAllPostsCallBack();
  }, [filters, accessToken]);

  useEffect(() => {
    getSellerProfile(`${CUSTOMER.GET_SELLER_PROFILE}/${id}`);
  }, [id]);

  useEffect(() => {
    getAllCategory(CUSTOMER.CATEGORY_LIST);
  }, []);

  useEffect(() => {
    getSellerReview(`${CUSTOMER.GET_SELLER_REVIEWS}?seller_id=${id}`);
  }, [id]);

  console.log("allPosts", allPosts);
  console.log("modalFilter", modalFilter);

  return (
    <>
      {loading ? (
        <ScreenLoader />
      ) : (
        <div className="spacer-x pb-10">
          <div className="pt-15">
            <div className="text-sm text-gray-500 mb-2">
              {t("home")} <span className="mx-1">{">"}</span>{" "}
              {t("searchButton")}
              <span className="mx-1">{">"}</span> {t("productDetails")}{" "}
              <span className="mx-1">{">"}</span> {t("sellerProfile")}
            </div>

            <h1 className="main-heading">{t("sellerProfile")}</h1>

            <div className="py-10">
              <div className="relative flex items-center justify-between bg-white shadow-md rounded-2xl p-4 w-full">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      sellerProfile?.user_profile_url
                        ? `${imagePath}/${sellerProfile?.user_profile_url}`
                        : defaultUser
                    }
                    alt="userImg"
                    className="w-60 h-45 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-bold pb-1">
                      {sellerProfile?.username}
                    </h3>
                    <RatingStar starValue={4.5} />
                    <p className="text-sm text-gray-500 pt-5">
                      {t("memberSince")} 14/01/2025
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      (window.location.href = `tel:${sellerProfile?.user?.phone}`)
                    }
                    className="flex gap-2 font-bold items-center px-6 py-3 bg-primary rounded-lg text-white hover:bg-primaryDark cursor-pointer transition"
                  >
                    <img src={headerContact} alt="icon" className="h-5 w-5" />{" "}
                    {sellerProfile?.user?.phone || "7777777777"}
                  </button>

                  <div className="absolute top-5 right-4">
                    <button
                      onClick={() => setShowReportButton(!showReportButton)}
                      className="text-gray-700"
                    >
                      <img src={menu} alt="userImg" className="w-6 h-6" />
                    </button>
                  </div>
                  {showReportButton && (
                    <div className="absolute top-12 right-4 z-10">
                      <button
                        onClick={() => setShowReportListModal(true)}
                        className="rounded-md shadow-md text-gray-700 bg-white p-4 flex items-center gap-2"
                      >
                        <img
                          src={reportUser}
                          alt="userImg"
                          className="w-6 h-6"
                        />
                        {t("reportSeller")}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <ListingFilter
            sellerReviews={sellerReviews}
            imagePath={imagePath}
            allCategory={allCategory}
            filters={filters}
            handleChange={handleChange}
            setModalFilter={setModalFilter}
            allPosts={allPosts}
            handleLikeUnlikePost={handleLikeUnlikePost}
          />
        </div>
      )}

      {showReportListModal && (
        <ReportListModal
          isOpen={showReportListModal}
          onClose={() => setShowReportListModal(false)}
          setShowReportButton={setShowReportButton}
          reportList={reportList}
          setReportId={setReportId}
          reportId={reportId}
          setCustomReason={setCustomReason}
          customReason={customReason}
          handleSubmit={handleSubmitSellerReport}
        />
      )}

      <LoginModal
        show={showLoginModal}
        hide={() => setShowLoginModal(false)}
        setShowLoginModal={setShowLoginModal}
      />
    </>
  );
};
