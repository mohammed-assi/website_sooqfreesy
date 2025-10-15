import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoginModal from "../../components/auth/LoginModal";
import { ScreenLoader } from "../../utils/screenLoader";
import useSearchDebounce from "../../utils/searchDebounce";
import { ROUTE } from "../../config/constants";
import moment from "moment";
import useDebounce from "../../utils/debounce";
import { City, Country, State } from "country-state-city";
import NotFoundPage from "../notFoundPage";
import { setNotifications } from "../../redux/slices/notificationSlice";

export const SellerProfile = () => {
  const { i18n, t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const imagePath = import.meta.env.VITE_APP_IMAGE_URL;
  const { accessToken } = useSelector((state) => state.auth);
  const { userInfo } = useSelector((state) => state.user);
  const reduxCoords = useSelector((state) => state.location.coords);
  const currency = useSelector((state) => state.currency.value);

  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showReportButton, setShowReportButton] = useState(false);
  const [showReportListModal, setShowReportListModal] = useState(false);

  const [sellerProfile, setSellerProfile] = useState(null);
  const [sellerReviews, setSellerReviews] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [modalFilter, setModalFilter] = useState({});
  const [reportList, setReportList] = useState([]);
  const [reportId, setReportId] = useState(null);
  const [customReason, setCustomReason] = useState("");

  // Filters state
  const [filters, setFilters] = useState({
    city: "",
    type: "",
    category: "",
    subCategory: "",
    priceRange: [0, 0],
  });
  const debouncedPriceRange = useDebounce(filters.priceRange, 800);
  const [searchTextDebounce, setSearchTextDebounce] = useSearchDebounce();
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [coords, setCoords] = useState({ lat: null, lng: null, country: null });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const lastRequestKeyRef = useRef(null);
  const requestTimerRef = useRef(null);

  // ======== Handlers ========
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const buildFilterObject = useCallback(() => {
    const filterObj = {};

    // categories
    if (filters.category) filterObj.category_id = Number(filters.category);
    if (filters.subCategory)
      filterObj.sub_category_id = Number(filters.subCategory);

    // price range
    if (debouncedPriceRange?.[0]) filterObj.price_min = debouncedPriceRange[0];
    if (debouncedPriceRange?.[1]) filterObj.price_max = debouncedPriceRange[1];

    // city & state
    if (selectedCity) filterObj.city = selectedCity;
    else if (filters.city) filterObj.city = filters.city;
    if (selectedState) filterObj.state = selectedState;

    // post type
    if (filters.type) filterObj.post_type = filters.type;

    // coordinates
    if (coords?.lat) filterObj.latitude = Number(coords.lat);
    if (coords?.lng) filterObj.longitude = Number(coords.lng);

    // search
    if (searchTextDebounce) filterObj.search = searchTextDebounce;

    return filterObj;
  }, [
    filters,
    debouncedPriceRange,
    searchTextDebounce,
    selectedCity,
    selectedState,
    coords,
  ]);

  // ======== API Calls ========
  const getAllPosts = async (url) => {
    setLoading(true);
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      setAllPosts(response?.data?.data?.posts || []);
    } else {
      setAllPosts([]);
    }
    setLoading(false);
  };

  const buildUrlForRequest = useCallback(
    (page = 1, includeSortingPrice = false) => {
      const filterObj = buildFilterObject();

      let url = `${POST.SELLER_POST}/${id}?page=${page}&limit=12`;

      if (includeSortingPrice) {
        const sorting =
          modalFilter?.sorting === "relevant" ? "relevant" : "newest";
        const byPrice = modalFilter?.price === "lowest" ? "lowest" : "highest";
        url += `&sorting=${sorting}&byPrice=${byPrice}`;
      }

      if (Object.keys(filterObj).length > 0) {
        url += `&filters=${encodeURIComponent(JSON.stringify(filterObj))}`;
      }

      return url;
    },
    [buildFilterObject, modalFilter, id]
  );

  const getAllPostsCallback = useCallback(() => {
    const filterObj = buildFilterObject();
    const requestKey = JSON.stringify({
      page: 1,
      filters: filterObj,
    });

    if (lastRequestKeyRef.current === requestKey) return;

    if (requestTimerRef.current) clearTimeout(requestTimerRef.current);

    requestTimerRef.current = setTimeout(() => {
      lastRequestKeyRef.current = requestKey;

      // Do NOT include sorting & byPrice for auto-fetch
      const url = buildUrlForRequest(1, false);
      getAllPosts(url);

      requestTimerRef.current = null;
    }, 1000);
  }, [buildFilterObject, buildUrlForRequest, accessToken]);

  const handleApplyFilters = () => {
    // Include sorting & byPrice only when user applies
    const url = buildUrlForRequest(1, true);
    getAllPosts(url);
  };

  const getAllCategory = async (url) => {
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      setAllCategory(response?.data?.data?.categories || []);
    }
  };

  const getSubCategory = async (url) => {
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      setSubCategoryList(response?.data?.data || []);
    }
  };

  const getSellerProfile = async (url) => {
    // setLoading(true);
    // const response = await getRequest(url);
    // if (response?.data?.success && response?.data?.statusCode === 200) {
    //   setSellerProfile(response?.data?.data || {});
    // } else {
    //   setSellerProfile(null);
    // }
    // setLoading(false);

    setLoading(true);
    try {
      const response = await getRequest(url);

      if (response?.data?.success && response?.data?.statusCode === 200) {
        setSellerProfile(response?.data?.data || {});
      } else {
        setSellerProfile(null);
      }
    } catch (error) {
      // Catch 404 or network errors
      console.log(error);
      setSellerProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const getSellerReview = async (url) => {
    setLoading(true);
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      setSellerReviews(response?.data?.data || []);
    }
    setLoading(false);
  };

  const getContactReportList = async (url) => {
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      setReportList(response?.data?.data || []);
    }
  };

  const handleSubmitSellerReport = async () => {
    if (reportId === null) {
      showErrorToast(t("reportReason"));
      return;
    }

    const payload = {
      seller_id: sellerProfile?.id,
      reportListing_id: reportId,
      reason: customReason,
    };

    try {
      const response = await postRequest(REPORT_LIST.REPORT_SELLER, payload);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        showSuccessToast(response?.data?.message || "Report submitted");
        setShowReportButton(false);
        setShowReportListModal(false);
        setReportId(null);
        setCustomReason("");
      }
    } catch (err) {
      showErrorToast(err?.response?.data?.message);
    }
  };

  const handleLikeUnlikePost = async (data) => {
    if (!accessToken) {
      setShowLoginModal(true);
      return;
    }

    const url = data?.isWishlisted ? POST.UNLIKE : POST.LIKE;

    const response = await getRequest(`${url}?listingId=${data?.id}`);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      showSuccessToast(response?.data?.message || "Updated wishlist");
      getAllPostsCallback();
      const res = await getRequest(CUSTOMER.NOTIFICTIN_COUNT);
      if (res?.data?.success && res?.data?.statusCode === 200) {
        dispatch(setNotifications(res?.data?.data));
      }
    }
  };

  // ======== Effects ========
  useEffect(() => {
    getContactReportList(`${REPORT_LIST.CONTACT_US}?reportType=SELLER`);
    getAllCategory(CUSTOMER.CATEGORY_LIST);
    getSellerProfile(`${CUSTOMER.GET_SELLER_PROFILE}/${id}`);
    getSellerReview(`${CUSTOMER.GET_SELLER_REVIEWS}?seller_id=${id}`);
  }, [id]);

  useEffect(() => {
    getAllPostsCallback();
  }, [
    filters,
    debouncedPriceRange,
    searchTextDebounce,
    modalFilter,
    selectedCity,
    selectedState,
    coords,
    getAllPostsCallback,
  ]);

  useEffect(() => {
    if (filters?.category) {
      getSubCategory(`${CUSTOMER.GET_SUBCATEGORY}/${filters?.category}`);
    } else {
      setSubCategoryList([]);
    }
  }, [filters?.category]);

  useEffect(() => {
    if (reduxCoords?.country) {
      const countryObj = Country.getAllCountries().find(
        (c) => c.name === reduxCoords.country
      );
      if (countryObj) {
        const stateList = State.getStatesOfCountry(countryObj.isoCode);
        setStates(stateList);
        setSelectedState("");
        setCities([]);
        setSelectedCity("");
      }
    }
  }, [reduxCoords?.country]);

  useEffect(() => {
    if (selectedState) {
      const cityList = City.getCitiesOfState(
        states.find((s) => s.name === selectedState)?.countryCode,
        states.find((s) => s.name === selectedState)?.isoCode
      );
      setCities(cityList);
      setSelectedCity("");
    }
  }, [selectedState, states]);

  const handleResetFilters = () => {
    setFilters({
      city: "",
      type: "",
      category: "",
      subCategory: "",
      priceRange: [0, 0],
    });

    setSelectedState("");
    setSelectedCity("");
    setSelectedLocation("");
    setCoords({ lat: null, lng: null, country: null });
    setSubCategoryList([]);
    setModalFilter({});
    setSearchTextDebounce("");

    const url = buildUrlForRequest(1, false);
    getAllPosts(url);
  };

  useEffect(() => {
    if (!currency) return;
    const url = buildUrlForRequest(1, false);
    getAllPosts(url);
  }, [currency]);

  if (loading) return <ScreenLoader />;

  if (!sellerProfile && !loading) return <NotFoundPage />;

  return (
    <>
      <div className="spacer-x pb-10">
        <div className="pt-10 md:pt-15">
          <div className="text-sm text-gray-500 mb-2">
            <Link className="hover:text-primary" to={ROUTE.ROOT}>
              {t("home")}
            </Link>{" "}
            <span className="mx-1">{">"}</span>{" "}
            <span
              onClick={() => navigate(-1)}
              className="cursor-pointer hover:text-primary"
            >
              {t("productDetails")}
            </span>{" "}
            <span className="mx-1">{">"}</span> {t("sellerProfile")}
          </div>

          <h1 className="main-heading">{t("sellerProfile")}</h1>

          <div className="py-10">
            <div className="relative flex flex-wrap md:flex-nowrap items-center gap-8 bg-white shadow-md rounded-2xl p-4 w-full">
              <div className="flex items-center gap-4 flex-shrink-0 w-full md:w-auto">
                <img
                  src={
                    sellerProfile?.user_profile_url
                      ? `${imagePath}/${sellerProfile?.user_profile_url}`
                      : defaultUser
                  }
                  alt="userImg"
                  className="w-full md:w-60 h-45 rounded-lg object-cover"
                />
              </div>

              <div className="flex justify-between items-center gap-3 flex-wrap w-full">
                <div>
                  <h3 className="text-xl font-bold pb-1">
                    {sellerProfile?.username}
                  </h3>
                  <RatingStar starValue={sellerProfile?.averageRating} />
                  <p className="text-sm text-gray-500 pt-5">
                    {t("memberSince")}{" "}
                    {moment(sellerProfile?.created_at).format("MM/DD/yyyy")}
                  </p>
                </div>
                <button
                  onClick={() =>
                    (window.location.href = `tel:${sellerProfile?.phone}`)
                  }
                  className="flex gap-2 font-bold items-center px-6 py-3 bg-primary rounded-lg text-white hover:bg-primaryDark cursor-pointer transition"
                >
                  <img src={headerContact} alt="icon" className="h-5 w-5" />{" "}
                  {sellerProfile?.phone || "7777777777"}
                </button>

                {userInfo?.id !== sellerProfile?.id && (
                  <div
                    className={`${
                      i18n.language === "ar" ? "left-4" : "right-4"
                    } absolute top-5`}
                  >
                    <button
                      onClick={() => setShowReportButton(!showReportButton)}
                      className="text-gray-700"
                    >
                      <img src={menu} alt="userImg" className="w-6 h-6" />
                    </button>
                  </div>
                )}
                {showReportButton && (
                  <div
                    className={`${
                      i18n.language === "ar" ? "left-4" : "right-4"
                    } absolute top-12 z-10`}
                  >
                    <button
                      onClick={() => {
                        if (accessToken) {
                          setShowReportListModal(true);
                        } else {
                          setShowLoginModal(true);
                        }
                      }}
                      className="rounded-md shadow-md text-gray-700 bg-white p-4 flex items-center gap-2"
                    >
                      <img src={reportUser} alt="userImg" className="w-6 h-6" />
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
          setSearchTextDebounce={setSearchTextDebounce}
          searchTextDebounce={searchTextDebounce}
          states={states}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          cities={cities}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          setSelectedLocation={setSelectedLocation}
          setCoords={setCoords}
          selectedLocation={selectedLocation}
          subCategoryList={subCategoryList}
          handleApplyFilters={handleApplyFilters}
          handleResetFilters={handleResetFilters}
        />
      </div>

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
