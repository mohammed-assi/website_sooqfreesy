// import React, {
//   useCallback,
//   useEffect,
//   useLayoutEffect,
//   useRef,
//   useState,
// } from "react";
// import { SearchTopFilter } from "../../components/searchPage/SearchTopFilter";
// import ProductFilter from "../../components/searchPage/ProductFilter";
// import { getRequest } from "../../config/apiFunctions";
// import { CUSTOMER, POST } from "../../config/endPoints";
// import { useLocation, useNavigate } from "react-router-dom";
// import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
// import { useDispatch, useSelector } from "react-redux";
// import LoginModal from "../../components/auth/LoginModal";
// import { ScreenLoader } from "../../utils/screenLoader";
// import useSearchDebounce from "../../utils/searchDebounce";
// import { City, Country, State } from "country-state-city";
// import { setNotifications } from "../../redux/slices/notificationSlice";

// export const ProductPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const imagePath = import.meta.env.VITE_APP_IMAGE_URL;

//   const { accessToken } = useSelector((state) => state.auth);
//   const reduxCoords = useSelector((state) => state.location.coords);
//   const currency = useSelector((state) => state.currency.value);

//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [toggleGrid, setToggleGrid] = useState(false);

//   const [allPosts, setAllPosts] = useState([]);
//   const [allCategory, setAllCategory] = useState([]);
//   const [allSubCategory, setAllSubCategory] = useState([]);
//   const [totalCount, setTotalCounts] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [subcategoryIds, setSubcategoryIds] = useState([]);
//   // const [filtersModal, setFiltersModal] = useState({});
//   const [filtersModal, setFiltersModal] = useState({
//     sorting: "newest",
//     price: "highest",
//   });
//   const [searchText, setSearchText] = useState("");
//   const [filters, setFilters] = useState({
//     city: "",
//     type: "",
//     category: "",
//     subCategory: "",
//     priceRange: [0, 0],
//   });

//   const [searchTextDebounce, setSearchTextDebounce] = useSearchDebounce();

//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");
//   const [selectedLocation, setSelectedLocation] = useState("");
//   const [coords, setCoords] = useState({ lat: null, lng: null, country: null });
//   const [subCategoryList, setSubCategoryList] = useState([]);

//   const totalPages = Math.ceil(totalCount / 12);
//   const lastRequestKeyRef = useRef(null);
//   const requestTimerRef = useRef(null);
//   const hasUsedSearchText = useRef(false);
//   const processedSubCatRef = useRef(new Set());

//   /** ------------------------------
//    * Handle Filter Changes
//    * ------------------------------ */
//   const handleChange = (key, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//     setCurrentPage(1);
//     clearLocationState();
//   };

//   const handleSelectSubcatIds = (id) => {
//     // setSubcategoryIds((prev) =>
//     //   prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     // );
//     // setCurrentPage(1);
//     // clearLocationState();
//     const idNum = Number(id);
//     setSubcategoryIds((prev) =>
//       prev.includes(idNum)
//         ? prev.filter((item) => item !== idNum)
//         : [...prev, idNum]
//     );
//     setCurrentPage(1);
//     clearLocationState();
//   };

//   /** ------------------------------
//    * Clear Location State When Filter Changes
//    * ------------------------------ */
//   const clearLocationState = useCallback(() => {
//     if (location.state && Object.keys(location.state).length > 0) {
//       navigate(location.pathname, { replace: true, state: {} });
//     }
//   }, [location, navigate]);

//   /** ------------------------------
//    * API: Get All Posts
//    * ------------------------------ */
//   const getAllPosts = useCallback(async (url) => {
//     setLoading(true);
//     try {
//       const response = await getRequest(url);
//       if (response?.data?.success && response?.data?.statusCode === 200) {
//         setAllPosts(response?.data?.data?.posts || []);
//         setTotalCounts(response?.data?.data?.totalCount || 0);
//       } else {
//         setAllPosts([]);
//         setTotalCounts(0);
//       }
//     } catch (err) {
//       console.error("Error fetching posts:", err);
//       showErrorToast(err?.response?.data?.message || "Failed to fetch posts");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   /** ------------------------------
//    * API: Categories and Subcategories
//    * ------------------------------ */
//   const getAllSubcategory = useCallback(async (url) => {
//     try {
//       const response = await getRequest(url);
//       if (response?.data?.success && response?.data?.statusCode === 200) {
//         setAllSubCategory(response?.data?.data?.subCategories || []);
//       }
//     } catch (err) {
//       console.error("Error fetching subcategories:", err);
//     }
//   }, []);

//   const getAllCategory = useCallback(async (url) => {
//     try {
//       const response = await getRequest(url);
//       if (response?.data?.success && response?.data?.statusCode === 200) {
//         setAllCategory(response?.data?.data?.categories || []);
//       }
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//     }
//   }, []);

//   const getSubCategory = async (url) => {
//     try {
//       const response = await getRequest(url);
//       if (response?.data?.success && response?.data?.statusCode === 200) {
//         setSubCategoryList(response?.data?.data || []);
//       }
//     } catch (error) {
//       showErrorToast(error?.response?.data?.message);
//     }
//   };

//   /** ------------------------------
//    * Build Filter Object
//    * ------------------------------ */

//   const buildFilterObject = useCallback(() => {
//     const filterObj = {};
//     if (filters.category) filterObj.category_id = Number(filters.category);
//     // if (filters.subCategory)
//     //   filterObj.sub_category = Number(filters.subCategory);
//     // if (subcategoryIds?.length) filterObj.sub_category_id = subcategoryIds;

//     if (filters.subCategory || subcategoryIds?.length) {
//       const allSubCategories = [];

//       if (filters.subCategory) {
//         allSubCategories.push(Number(filters.subCategory));
//       }

//       if (subcategoryIds?.length) {
//         allSubCategories.push(...subcategoryIds.map(Number));
//       }

//       filterObj.sub_category_id = allSubCategories;
//     }
//     if (filters.priceRange?.[0]) filterObj.price_min = filters.priceRange[0];
//     if (filters.priceRange?.[1]) filterObj.price_max = filters.priceRange[1];
//     if (reduxCoords?.country) filterObj.country = reduxCoords?.country;
//     if (selectedCity) filterObj.city = selectedCity;
//     else if (filters.city) filterObj.city = filters.city;
//     if (filters.type) filterObj.post_type = filters.type;
//     if (searchTextDebounce) filterObj.searchtext = searchTextDebounce;
//     // if (location?.state?.search) filterObj.searchtext = location.state.search;
//     if (selectedState) filterObj.state = selectedState;
//     if (coords?.lat) filterObj.latitude = Number(coords.lat);
//     if (coords?.lng) filterObj.longitude = Number(coords.lng);
//     return filterObj;
//   }, [
//     filters,
//     subcategoryIds,
//     searchTextDebounce,
//     // location?.state?.search,
//     selectedCity,
//     selectedState,
//     coords,
//     reduxCoords,
//   ]);

//   /** ------------------------------
//    * Build URL for API Request
//    * ------------------------------ */
//   const buildUrlForRequest = useCallback(
//     (page = currentPage, applySortingPrice = false, passedFilters = null) => {
//       const filterObj = buildFilterObject();
//       let url = `${POST.GET_ALL}?page=${page}&limit=12`;

//       if (applySortingPrice) {
//         const sorting =
//           passedFilters?.sorting || filtersModal?.sorting || "newest";
//         const byPrice =
//           passedFilters?.price || filtersModal?.price || "highest";
//         url += `&sorting=${sorting}&byPrice=${byPrice}`;
//       }

//       if (Object.keys(filterObj).length > 0) {
//         url += `&filters=${encodeURIComponent(JSON.stringify(filterObj))}`;
//       }
//       return url;
//     },
//     [buildFilterObject, currentPage, filtersModal]
//   );

//   /** ------------------------------
//    * Fetch Posts When Filters Change
//    * ------------------------------ */
//   useEffect(() => {
//     if (requestTimerRef.current) clearTimeout(requestTimerRef.current);

//     const filterObj = buildFilterObject();
//     const requestKey = JSON.stringify({
//       page: currentPage,
//       filters: filterObj,
//     });
//     if (lastRequestKeyRef.current === requestKey) return;

//     requestTimerRef.current = setTimeout(() => {
//       lastRequestKeyRef.current = requestKey;
//       const url = buildUrlForRequest(currentPage, false);
//       getAllPosts(url);
//       requestTimerRef.current = null;
//     }, 600);

//     return () => {
//       if (requestTimerRef.current) clearTimeout(requestTimerRef.current);
//     };
//   }, [
//     currentPage,
//     filters,
//     subcategoryIds,
//     searchTextDebounce,
//     buildFilterObject,
//     buildUrlForRequest,
//     getAllPosts,
//     selectedCity,
//     selectedState,
//     coords,
//   ]);

//   /** ------------------------------
//    * Initial Fetch
//    * ------------------------------ */
//   useEffect(() => {

//     if (location.state?.searchText || location.state?.search) return;
//     if (location.state?.subCatId) return;

//     const filterObj = buildFilterObject();
//     const url =
//       Object.keys(filterObj).length === 0
//         ? `${POST.GET_ALL}?page=1&limit=12`
//         : buildUrlForRequest(1, false);
//     getAllPosts(url);
//   }, []);

//   /** ------------------------------
//    * Handle Search from Location State
//    * ------------------------------ */
//   // useLayoutEffect(() => {
//   //   if (location.state?.searchText) {
//   //     hasUsedSearchText.current = true;
//   //     setSearchText(location.state.searchText);
//   //     setSearchTextDebounce(location.state.searchText);
//   //   }
//   // }, [location, setSearchTextDebounce]);

//   useLayoutEffect(() => {
//     const text = location.state?.searchText || location.state?.search || "";

//     if (text) {
//       lastRequestKeyRef.current = null;
//       hasUsedSearchText.current = true;
//       setSearchText(text);
//       setSearchTextDebounce(text);
//       navigate(location.pathname, { replace: true, state: {} });
//     }
//   }, [
//     location.state?.searchText,
//     location.state?.search,
//     navigate,
//     setSearchTextDebounce,
//   ]);

//   /** ------------------------------
//    * Apply Filter Sorting
//    * ------------------------------ */
//   const handleApplyFilters = (values) => {
//     const url = buildUrlForRequest(currentPage, true, values);
//     getAllPosts(url);
//   };

//   /** ------------------------------
//    * Reset Search if Filters Change
//    * ------------------------------ */
//   // useEffect(() => {
//   //   if (
//   //     hasUsedSearchText.current &&
//   //     (filters.category ||
//   //       filters.city ||
//   //       filters.type ||
//   //       subcategoryIds?.length ||
//   //       currentPage > 1 ||
//   //       filters.subCategory)
//   //   ) {
//   //     hasUsedSearchText.current = false;
//   //     setSearchText("");
//   //     setSearchTextDebounce("");
//   //     clearLocationState();
//   //   }
//   // }, [
//   //   filters,
//   //   subcategoryIds,
//   //   currentPage,
//   //   setSearchTextDebounce,
//   //   clearLocationState,
//   // ]);

//   /** ------------------------------
//    * Fetch Category / Subcategory Data
//    * ------------------------------ */
//   useEffect(() => {
//     getAllSubcategory(CUSTOMER.GET_ALL_SUBCATEGORY);
//     getAllCategory(CUSTOMER.CATEGORY_LIST);
//   }, [getAllSubcategory, getAllCategory]);

//   useEffect(() => {
//     if (location?.state?.categoryName && allCategory?.length) {
//       const matchedId = allCategory.find(
//         (cat) => String(cat.name) === String(location.state.categoryName)
//       )?.id;

//       if (matchedId) {
//         setFilters((prev) => ({ ...prev, category: matchedId }));
//       }
//       clearLocationState();
//     }
//   }, [location?.state?.categoryName, allCategory, clearLocationState]);

//   useEffect(() => {
//     if (filters?.category) {
//       getSubCategory(`${CUSTOMER.GET_SUBCATEGORY}/${filters?.category}`);
//     } else {
//       setSubCategoryList([]);
//     }
//   }, [filters?.category]);

//   /** ------------------------------
//    * Handle Wishlist Like/Unlike
//    * ------------------------------ */
//   const handleLikeUnlikePost = async (data) => {
//     if (!accessToken) {
//       setShowLoginModal(true);
//       return;
//     }

//     const url = data?.isWishlisted ? POST.UNLIKE : POST.LIKE;

//     try {
//       const response = await getRequest(`${url}?listingId=${data?.id}`);
//       if (response?.data?.success && response?.data?.statusCode === 200) {
//         showSuccessToast(response?.data?.message || "Updated wishlist");
//         lastRequestKeyRef.current = null;
//         const urlForCurrent = buildUrlForRequest(currentPage);
//         getAllPosts(urlForCurrent);

//         const res = await getRequest(CUSTOMER.NOTIFICTIN_COUNT);
//         if (res?.data?.success && res?.data?.statusCode === 200) {
//           dispatch(setNotifications(res?.data?.data));
//         }
//       } else {
//         showErrorToast("Unable to update wishlist");
//       }
//     } catch (error) {
//       showErrorToast(
//         error?.response?.data?.message || "Failed to update wishlist"
//       );
//     }
//   };

//   const handleResetFilters = () => {
//     setFilters({
//       city: "",
//       type: "",
//       category: "",
//       subCategory: "",
//       priceRange: [0, 0],
//     });
//     setSelectedState("");
//     setSelectedCity("");
//     setSelectedLocation("");
//     setCoords({ lat: null, lng: null, country: null });
//     setSubcategoryIds([]);
//     setSubCategoryList([]);
//     setCurrentPage(1);
//     clearLocationState();

//     setSearchText("");
//     setSearchTextDebounce("");
//     hasUsedSearchText.current = false;

//     window.dispatchEvent(new Event("clear-search-input"));
//   };

//   /** ------------------------------
//    * Country / State / City Handling
//    * ------------------------------ */
//   useEffect(() => {
//     if (reduxCoords?.country) {
//       const countryObj = Country.getAllCountries().find(
//         (c) => c.name === reduxCoords.country
//       );
//       if (countryObj) {
//         const stateList = State.getStatesOfCountry(countryObj.isoCode);
//         setStates(stateList);
//         setSelectedState("");
//         setCities([]);
//         setSelectedCity("");
//       }
//     }
//   }, [reduxCoords?.country]);

//   useEffect(() => {
//     if (selectedState) {
//       const stateObj = states.find((s) => s.name === selectedState);
//       if (stateObj) {
//         const cityList = City.getCitiesOfState(
//           stateObj.countryCode,
//           stateObj.isoCode
//         );
//         setCities(cityList);
//         setSelectedCity("");
//       }
//     }
//   }, [selectedState, states]);

//   useEffect(() => {
//     if (!currency) return;
//     const url = buildUrlForRequest(currentPage, false);
//     getAllPosts(url);
//   }, [currency]);

//   useEffect(() => {
//     const rawId = location.state?.subCatId;
//     if (!rawId) return;

//     const key = String(rawId);
//     // If we've already processed this id, skip
//     if (processedSubCatRef.current.has(key)) return;
//     processedSubCatRef.current.add(key);

//     const idNum = Number(rawId);
//     if (isNaN(idNum)) return;

//     setSubcategoryIds((prev) =>
//       prev.includes(idNum)
//         ? prev.filter((item) => item !== idNum)
//         : [...prev, idNum]
//     );
//     setCurrentPage(1);

//     // DO NOT clear location.state synchronously here — keeping it prevents the race.
//     // If you still want to remove the navigation state afterwards, do it from
//     // another user action (like when filters change) using your existing clearLocationState().
//   }, [location.state?.subCatId]);

//   if (loading) return <ScreenLoader />;

//   return (
//     <div className="spacer-x">
//       <SearchTopFilter
//         categories={allSubCategory}
//         toggleGrid={toggleGrid}
//         setToggleGrid={setToggleGrid}
//         handleSelectSubcatIds={handleSelectSubcatIds}
//         subcategoryIds={subcategoryIds}
//         setFiltersModal={setFiltersModal}
//         filtersModal={filtersModal}
//         searchText={searchText}
//         setSearchText={setSearchText}
//         setSearchTextDebounce={setSearchTextDebounce}
//         filters={filters}
//         handleApplyFilters={handleApplyFilters}
//       />

//       <ProductFilter
//         toggleGrid={toggleGrid}
//         allPosts={allPosts}
//         imagePath={imagePath}
//         setCurrentPage={setCurrentPage}
//         currentPage={currentPage}
//         totalPages={totalPages}
//         allCategory={allCategory}
//         handleChange={handleChange}
//         filters={filters}
//         handleLikeUnlikePost={handleLikeUnlikePost}
//         setSearchTextDebounce={setSearchTextDebounce}
//         searchTextDebounce={searchTextDebounce}
//         states={states}
//         selectedState={selectedState}
//         setSelectedState={setSelectedState}
//         cities={cities}
//         selectedCity={selectedCity}
//         setSelectedCity={setSelectedCity}
//         setSelectedLocation={setSelectedLocation}
//         setCoords={setCoords}
//         selectedLocation={selectedLocation}
//         subCategoryList={subCategoryList}
//         handleResetFilters={handleResetFilters}
//       />

//       <LoginModal
//         show={showLoginModal}
//         hide={() => setShowLoginModal(false)}
//         setShowLoginModal={setShowLoginModal}
//       />
//     </div>
//   );
// };

// export default ProductPage;

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getRequest } from "../../config/apiFunctions";
import { CUSTOMER, POST } from "../../config/endPoints";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import { setNotifications } from "../../redux/slices/notificationSlice";
import { ScreenLoader } from "../../utils/screenLoader";
import useSearchDebounce from "../../utils/searchDebounce";
import { City, Country, State } from "country-state-city";

import { SearchTopFilter } from "../../components/searchPage/SearchTopFilter";
import ProductFilter from "../../components/searchPage/ProductFilter";
import LoginModal from "../../components/auth/LoginModal";

export const ProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const imagePath = import.meta.env.VITE_APP_IMAGE_URL;

  const { accessToken } = useSelector((state) => state.auth);
  const reduxCoords = useSelector((state) => state.location.coords);
  const currency = useSelector((state) => state.currency.value);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toggleGrid, setToggleGrid] = useState(false);

  const [allPosts, setAllPosts] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [allSubCategory, setAllSubCategory] = useState([]);
  const [totalCount, setTotalCounts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [subcategoryIds, setSubcategoryIds] = useState([]);
  const [filtersModal, setFiltersModal] = useState({
    sorting: "newest",
    price: "highest",
  });
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    type: "",
    category: "",
    subCategory: "",
    priceRange: [0, 0],
  });

  const [searchTextDebounce, setSearchTextDebounce] = useSearchDebounce();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [coords, setCoords] = useState({ lat: null, lng: null, country: null });
  const [subCategoryList, setSubCategoryList] = useState([]);

  const totalPages = Math.ceil(totalCount / 12);
  const lastRequestKeyRef = useRef(null);
  const requestTimerRef = useRef(null);
  const hasUsedSearchText = useRef(false);
  const processedSubCatRef = useRef(new Set());

  const hasSetCategoryFromLocation = useRef(false);

  /** ------------------------------
   * Clear Location State
   * ------------------------------ */
  const clearLocationState = useCallback(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      navigate(location.pathname, { replace: true, state: {} });
      navigate(location.pathname, { replace: true, state: {} });
   // allow immediate refetch after navigation-by-state
    lastRequestKeyRef.current = null;
    }
  }, [location, navigate]);

  /** ------------------------------
   * Fetch Categories & Subcategories
   * ------------------------------ */
  const getAllCategory = useCallback(async () => {
    try {
      const response = await getRequest(CUSTOMER.CATEGORY_LIST);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setAllCategory(response?.data?.data?.categories || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  const getAllSubcategory = useCallback(async () => {
    try {
      const response = await getRequest(CUSTOMER.GET_ALL_SUBCATEGORY);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setAllSubCategory(response?.data?.data?.subCategories || []);
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  }, []);

  /** ------------------------------
   * Fetch Posts
   * ------------------------------ */
  const inFlightRequestsRef = useRef(new Set());
  const recentRequestsRef = useRef(new Map());
  const hasFetchedOnceRef = useRef(false);
  const RECENT_TTL = 1000;

  const getAllPosts = useCallback(async (url) => {
    if (!url) return;

    const now = Date.now();
    const recent = recentRequestsRef.current;
    const lastTs = recent.get(url);
    if (lastTs && now - lastTs < RECENT_TTL) {
      // recently called this exact URL — skip to avoid immediate duplicate
      // console.debug("Skipping recent duplicate url:", url);
      return;
    }

    const inFlight = inFlightRequestsRef.current;
    if (inFlight.has(url)) {
      // already in-flight (concurrent) -> dedupe
      // console.debug("Already in-flight:", url);
      return;
    }

    inFlight.add(url);
    // mark as attempted now so sequential calls within TTL are ignored
    recent.set(url, now);
    setLoading(true);
    try {
      const response = await getRequest(url);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setAllPosts(response?.data?.data?.posts || []);
        setTotalCounts(response?.data?.data?.totalCount || 0);
      } else {
        setAllPosts([]);
        setTotalCounts(0);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      showErrorToast(err?.response?.data?.message || "Failed to fetch posts");
    } finally {
      inFlight.delete(url);
      setLoading(false);
      hasFetchedOnceRef.current = true;
    }
  }, []);

  /** ------------------------------
   * Fetch Subcategories for a Category
   * ------------------------------ */
  const getSubCategory = async (categoryId) => {
    try {
      const response = await getRequest(
        `${CUSTOMER.GET_SUBCATEGORY}/${categoryId}`
      );
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setSubCategoryList(response?.data?.data || []);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    }
  };

  /** ------------------------------
   * Build Filter Object
   * ------------------------------ */
  const buildFilterObject = useCallback(() => {
    const filterObj = {};
    if (filters.category) filterObj.category_id = Number(filters.category);
    if (filters.subCategory || subcategoryIds.length) {
      const allSubCategories = [];
      if (filters.subCategory)
        allSubCategories.push(Number(filters.subCategory));
      if (subcategoryIds.length)
        allSubCategories.push(...subcategoryIds.map(Number));
      filterObj.sub_category_id = allSubCategories;
    }
    if (filters.priceRange?.[0]) filterObj.price_min = filters.priceRange[0];
    if (filters.priceRange?.[1]) filterObj.price_max = filters.priceRange[1];
    if (reduxCoords?.country) filterObj.country = reduxCoords.country;
    if (selectedCity) filterObj.city = selectedCity;
    else if (filters.city) filterObj.city = filters.city;
    if (filters.type) filterObj.post_type = filters.type;
    if (searchTextDebounce) filterObj.searchtext = searchTextDebounce;
    if (selectedState) filterObj.state = selectedState;
    if (coords?.lat) filterObj.latitude = Number(coords.lat);
    if (coords?.lng) filterObj.longitude = Number(coords.lng);
    return filterObj;
  }, [
    filters,
    subcategoryIds,
    searchTextDebounce,
    selectedCity,
    selectedState,
    coords,
    reduxCoords,
  ]);

  /** ------------------------------
   * Build API URL
   * ------------------------------ */
  const buildUrlForRequest = useCallback(
    (page = currentPage, applySortingPrice = false, passedFilters = null) => {
      const filterObj = buildFilterObject();
      let url = `${POST.GET_ALL}?page=${page}&limit=12`;

      if (applySortingPrice) {
        const sorting =
          passedFilters?.sorting || filtersModal?.sorting || "newest";
        const byPrice =
          passedFilters?.price || filtersModal?.price || "highest";
        url += `&sorting=${sorting}&byPrice=${byPrice}`;
      }

      if (Object.keys(filterObj).length > 0) {
        url += `&filters=${encodeURIComponent(JSON.stringify(filterObj))}`;
      }
      return url;
    },
    [buildFilterObject, currentPage, filtersModal]
  );

  /** ------------------------------
   * Handle Filter Changes
   * ------------------------------ */
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
    clearLocationState();
  };

  const handleSelectSubcatIds = (id) => {
    const idNum = Number(id);
    setSubcategoryIds((prev) =>
      prev.includes(idNum)
        ? prev.filter((item) => item !== idNum)
        : [...prev, idNum]
    );
    setCurrentPage(1);
    clearLocationState();
  };

  /** ------------------------------
   * Set category from location.state (once)
   * ------------------------------ */
  useEffect(() => {
    if (location?.state?.categoryId && !hasSetCategoryFromLocation.current) {
      hasSetCategoryFromLocation.current = true;
      setFilters((prev) => ({
        ...prev,
        category: location?.state?.categoryId,
      }));
      setCurrentPage(1);
   lastRequestKeyRef.current = null;
 recentRequestsRef.current.clear()
      clearLocationState();
    }
  }, [location?.state, clearLocationState]);

  /** ------------------------------
   * Fetch Subcategories when category changes
   * ------------------------------ */
  useEffect(() => {
    if (filters.category) {
      getSubCategory(filters.category);
    } else {
      setSubCategoryList([]);
    }
  }, [filters.category]);

  useEffect(() => {
  if (requestTimerRef.current) clearTimeout(requestTimerRef.current);

  if (hasSetCategoryFromLocation.current) {
    hasSetCategoryFromLocation.current = false;
    lastRequestKeyRef.current = null;
  }

  const filterObj = buildFilterObject();
  const requestKey = JSON.stringify({
    page: currentPage,
    filters: filterObj,
  });
  if (lastRequestKeyRef.current === requestKey) return;

  requestTimerRef.current = setTimeout(() => {
    lastRequestKeyRef.current = requestKey;
    const url = buildUrlForRequest(currentPage, false);
    getAllPosts(url);
    requestTimerRef.current = null;
  }, 600);

  return () => {
    if (requestTimerRef.current) clearTimeout(requestTimerRef.current);
  };
}, [
  currentPage,
  filters,
  subcategoryIds,
  searchTextDebounce,
  buildFilterObject,
  buildUrlForRequest,
  getAllPosts,
  selectedCity,
  selectedState,
  coords
]);

  /** ------------------------------
   * Initial Fetch: categories & subcategories
   * ------------------------------ */
  useEffect(() => {
    getAllCategory();
    getAllSubcategory();
  }, [getAllCategory, getAllSubcategory]);

  /** ------------------------------
   * Handle Search from location.state
   * ------------------------------ */
  useLayoutEffect(() => {
    const text = location.state?.searchText || location.state?.search || "";
    if (!text) return;

    hasUsedSearchText.current = true;
    setSearchText(text);
    setSearchTextDebounce(text);
    navigate(location.pathname, { replace: true, state: {} });
  }, [
    location.state?.searchText,
    location.state?.search,
    navigate,
    setSearchTextDebounce,
  ]);

  /** ------------------------------
   * Wishlist Like/Unlike
   * ------------------------------ */
  const handleLikeUnlikePost = async (data) => {
    if (!accessToken) {
      setShowLoginModal(true);
      return;
    }

    const url = data?.isWishlisted ? POST.UNLIKE : POST.LIKE;
    try {
      const response = await getRequest(`${url}?listingId=${data?.id}`);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        showSuccessToast(response?.data?.message || "Updated wishlist");
        lastRequestKeyRef.current = null;
        const urlForCurrent = buildUrlForRequest(currentPage);
        getAllPosts(urlForCurrent);

        const res = await getRequest(CUSTOMER.NOTIFICTIN_COUNT);
        if (res?.data?.success && res?.data?.statusCode === 200) {
          dispatch(setNotifications(res?.data?.data));
        }
      } else {
        showErrorToast("Unable to update wishlist");
      }
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message || "Failed to update wishlist"
      );
    }
  };

  /** ------------------------------
   * Handle Reset Filters
   * ------------------------------ */
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
    setSubcategoryIds([]);
    setSubCategoryList([]);
    setCurrentPage(1);
    clearLocationState();

    setSearchText("");
    setSearchTextDebounce("");
    hasUsedSearchText.current = false;

    window.dispatchEvent(new Event("clear-search-input"));
  };

  /** ------------------------------
   * Country/State/City handling
   * ------------------------------ */
  useEffect(() => {
    if (!reduxCoords?.country) return;

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
  }, [reduxCoords?.country]);

  useEffect(() => {
    if (!selectedState) return;
    const stateObj = states.find((s) => s.name === selectedState);
    if (stateObj) {
      const cityList = City.getCitiesOfState(
        stateObj.countryCode,
        stateObj.isoCode
      );
      setCities(cityList);
      setSelectedCity("");
    }
  }, [selectedState, states]);

  // useEffect(() => {
  //   if (!currency) return;
  //   const url = buildUrlForRequest(currentPage, false);
  //   getAllPosts(url);
  // }, [currency]);

useEffect(() => {
  if (!currency) return;

  setCurrentPage(1);
  lastRequestKeyRef.current = null;
  recentRequestsRef.current.clear();
  const url = buildUrlForRequest(1, false);
  getAllPosts(url);
}, [currency, buildUrlForRequest, getAllPosts]);

  /** ------------------------------
   * SubCatId from location.state (once)
   * ------------------------------ */
  useEffect(() => {
    const rawId = location.state?.subCatId;
    if (!rawId) return;

    const key = String(rawId);
    if (processedSubCatRef.current.has(key)) return;
    processedSubCatRef.current.add(key);

    const idNum = Number(rawId);
    if (isNaN(idNum)) return;

    setSubcategoryIds((prev) =>
      prev.includes(idNum)
        ? prev.filter((item) => item !== idNum)
        : [...prev, idNum]
    );
    setCurrentPage(1);
  }, [location.state?.subCatId]);

  // if (loading) return <ScreenLoader />;
  if (!hasFetchedOnceRef.current || loading) return <ScreenLoader />;

  return (
    <div className="spacer-x">
      <SearchTopFilter
        categories={allSubCategory}
        toggleGrid={toggleGrid}
        setToggleGrid={setToggleGrid}
        handleSelectSubcatIds={handleSelectSubcatIds}
        subcategoryIds={subcategoryIds}
        setFiltersModal={setFiltersModal}
        filtersModal={filtersModal}
        searchText={searchText}
        setSearchText={setSearchText}
        setSearchTextDebounce={setSearchTextDebounce}
        filters={filters}
        // handleApplyFilters={(values) => {
        //   const url = buildUrlForRequest(currentPage, true, values);
        //   getAllPosts(url);
        // }}
        handleApplyFilters={(values) => {
          setFiltersModal(values);
          setCurrentPage(1);
          lastRequestKeyRef.current = null;
        }}
      />

      <ProductFilter
        toggleGrid={toggleGrid}
        allPosts={allPosts}
        imagePath={imagePath}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalPages={totalPages}
        allCategory={allCategory}
        handleChange={handleChange}
        filters={filters}
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
        handleResetFilters={handleResetFilters}
      />

      <LoginModal
        show={showLoginModal}
        hide={() => setShowLoginModal(false)}
        setShowLoginModal={setShowLoginModal}
      />
    </div>
  );
};

export default ProductPage;
