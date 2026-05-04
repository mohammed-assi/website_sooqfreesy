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

  const queryParams = new URLSearchParams(location.search);
  const categoryIdFromUrl = queryParams.get('category');

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
  // const [subcategoryIds, setSubcategoryIds] = useState([]);
    const [subcategoryIds, setSubcategoryIds] = useState(null);

  const [filtersModal, setFiltersModal] = useState({
    sorting: "newest",
    price: "highest",
  });

  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState(() => ({
    city: "",
    type: "",
    category: categoryIdFromUrl || location?.state?.categoryId || "",
    subCategory: "",
    priceRange: [0, 0],
  }));

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

  const inFlightRequestsRef = useRef(new Set());
  const recentRequestsRef = useRef(new Map());
  const hasFetchedOnceRef = useRef(false);
  const RECENT_TTL = 1000;

  const hasSetCategoryFromLocation = useRef(false);
  const isInitialMount = useRef(true);

  /** ------------------------------
   * Clear Location State
   * ------------------------------ */
  const clearLocationState = useCallback(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      navigate(location.pathname, { replace: true, state: {} });
      lastRequestKeyRef.current = null;
      recentRequestsRef.current.clear();
    }
  }, [location, navigate]);

  /** ------------------------------
   * API: Get Categories / Subcategories
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
   * Fetch Posts (deduped + in-flight safe)
   * ------------------------------ */
  const getAllPosts = useCallback(async (url) => {
    if (!url) return;

    const now = Date.now();
    const recent = recentRequestsRef.current;
    const lastTs = recent.get(url);
    if (lastTs && now - lastTs < RECENT_TTL) {
      return;
    }

    const inFlight = inFlightRequestsRef.current;
    if (inFlight.has(url)) {
      return;
    }

    inFlight.add(url);
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
   * Build Filter Object
   * ------------------------------ */
  const buildFilterObject = useCallback(() => {
    const filterObj = {};
    if (filters.category) filterObj.category_id = Number(filters.category);
    if (filters.subCategory || subcategoryIds) {
  const allSubCategories = [];

  if (filters.subCategory) {
    allSubCategories.push(Number(filters.subCategory));
  }

  if (subcategoryIds) {
    allSubCategories.push(Number(subcategoryIds));
  }

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

    if (key === 'category') {
      const params = new URLSearchParams(location.search);
      if (value) {
        params.set('categoryId', value);
      } else {
        params.delete('categoryId');
      }
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }

    clearLocationState();
    lastRequestKeyRef.current = null;
  };

const handleSelectSubcatIds = (id) => {
  const idNum = Number(id);

  setSubcategoryIds((prev) => (prev === idNum ? null : idNum));

  setCurrentPage(1);
  clearLocationState();
  lastRequestKeyRef.current = null;
};

  /** ------------------------------
   * Fetch Subcategories when category changes
   * ------------------------------ */
  useEffect(() => {
    const categoryId = filters.category;
    
    const fetchData = async () => {
      try {
        setSubCategoryList([]);

        let response;

        if (categoryId) {
          response = await getRequest(
            `${CUSTOMER.GET_SUBCATEGORY}/${categoryId}`
          );
          console.log('Subcategories for category:', categoryId, response?.data?.data);
        } else {
          response = await getRequest(CUSTOMER.GET_ALL_SUBCATEGORY);
        }

        if (response?.data?.success) {
          setSubCategoryList(
            response?.data?.data?.subCategories ||
            response?.data?.data ||
            []
          );
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        showErrorToast(error?.response?.data?.message);
      }
    };

    fetchData();
  }, [filters.category]);

  /** ------------------------------
   * MAIN EFFECT: Watch filters and fetch posts
   * ------------------------------ */
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
      console.log('Fetching posts with URL:', url);
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
    coords,
  ]);

  /** ------------------------------
   * Handle URL parameter changes (for refresh and browser navigation)
   * ------------------------------ */
  useEffect(() => {
    const categoryId = queryParams.get('categoryId');
    if (categoryId && filters.category !== categoryId) {
      console.log('URL category changed, updating filters:', categoryId);
      setFilters(prev => ({ ...prev, category: categoryId }));
      setCurrentPage(1);
      lastRequestKeyRef.current = null;
      recentRequestsRef.current.clear();
    }
  }, [location.search]);

  /** ------------------------------
   * Initial Fetch: categories & subcategories
   * ------------------------------ */
  useEffect(() => {
    getAllCategory();
    getAllSubcategory();
  }, [getAllCategory, getAllSubcategory]);

  /** ------------------------------
   * Apply category from location.state
   * ------------------------------ */
  useLayoutEffect(() => {
    const navCategoryId = location?.state?.categoryId;
    if (navCategoryId) {
      hasSetCategoryFromLocation.current = true;
      setFilters((prev) => ({ ...prev, category: navCategoryId }));
      setCurrentPage(1);
      lastRequestKeyRef.current = null;
      recentRequestsRef.current.clear();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location?.state?.categoryId, navigate]);

  /** ------------------------------
   * Search from location.state
   * ------------------------------ */
  useLayoutEffect(() => {
    const text = location.state?.searchText || location.state?.search || "";
    if (!text) return;

    hasUsedSearchText.current = true;
    setSearchText(text);
    setSearchTextDebounce(text);
    navigate(location.pathname, { replace: true, state: {} });
    lastRequestKeyRef.current = null;
    recentRequestsRef.current.clear();
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
   * Reset Filters
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
    // setSubcategoryIds([]);
    setSubcategoryIds(null);
    setSubCategoryList([]);
    setCurrentPage(1);
    clearLocationState();

    setSearchText("");
    setSearchTextDebounce("");
    hasUsedSearchText.current = false;

    lastRequestKeyRef.current = null;
    recentRequestsRef.current.clear();

    // Clear URL parameters
    navigate(location.pathname, { replace: true });

    window.dispatchEvent(new Event("clear-search-input"));
  };

  /** ------------------------------
   * Country / State / City handling
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

  /** ------------------------------
   * Currency change handling
   * ------------------------------ */
  const prevCurrencyRef = useRef(currency);

  useEffect(() => {
    if (!currency) return;

    if (prevCurrencyRef.current !== currency) {
      prevCurrencyRef.current = currency;
      setCurrentPage(1);
      lastRequestKeyRef.current = null;
      recentRequestsRef.current.clear();
    }
  }, [currency]);

  /** ------------------------------
   * SubCatId from location.state
   * ------------------------------ */
  useEffect(() => {
    const rawId = location.state?.subCatId;
    if (!rawId) return;

    const key = String(rawId);
    if (processedSubCatRef.current.has(key)) return;
    processedSubCatRef.current.add(key);

    const idNum = Number(rawId);
    if (isNaN(idNum)) return;

    // setSubcategoryIds((prev) =>
    //   prev.includes(idNum)
    //     ? prev.filter((item) => item !== idNum)
    //     : [...prev, idNum]
    // );
    setSubcategoryIds(idNum);

    setCurrentPage(1);
    lastRequestKeyRef.current = null;
  }, [location.state?.subCatId]);

  if (!hasFetchedOnceRef.current || loading) return <ScreenLoader />;

  return (
    <div className="spacer-x">
      <div className="max-w-6xl mx-auto px-4">
        <SearchTopFilter
          categories={subCategoryList}
            imagePath={imagePath}   
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
          handleApplyFilters={(values) => {
            setFiltersModal(values);
            lastRequestKeyRef.current = null;
          }}
        />
      </div>

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
