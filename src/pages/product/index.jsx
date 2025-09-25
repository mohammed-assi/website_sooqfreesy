import React, { useCallback, useEffect, useRef, useState } from "react";
import { SearchTopFilter } from "../../components/searchPage/SearchTopFilter";
import ProductFilter from "../../components/searchPage/ProductFilter";
import { getRequest } from "../../config/apiFunctions";
import { CUSTOMER, POST } from "../../config/endPoints";
import { useLocation, useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import { useSelector } from "react-redux";
import LoginModal from "../../components/auth/LoginModal";
import { ScreenLoader } from "../../utils/screenLoader";
import useSearchDebounce from "../../utils/searchDebounce";
import useDebounce from "../../utils/debounce";

export const ProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const imagePath = import.meta.env.VITE_APP_IMAGE_URL;
  const { accessToken } = useSelector((state) => state.auth);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toggleGrid, setToggleGrid] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [allSubCategory, setAllSubCategory] = useState([]);
  const [totalCount, setTotalCounts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [subcategoryIds, setSubcategoryIds] = useState([]);
  const [filtersModal, setFiltersModal] = useState({});
  const [searchText, setSearchText] = useState(""); // immediate input/search string
  const hasUsedSearchText = useRef(false); // to handle clearing location state usage
  const [filters, setFilters] = useState({
    city: "",
    type: "",
    category: "",
    priceRange: [0, 0],
  });
  const debouncedPriceRange = useDebounce(filters.priceRange, 800);

  // Use your existing debounce hook (assumed API: [debouncedValue, setDebouncedValue])
  const [searchTextDebounce, setSearchTextDebounce] = useSearchDebounce();

  const totalPages = Math.ceil(totalCount / 12);

  // Keep a requestKey to dedupe identical requests and prevent double-calls
  const lastRequestKeyRef = useRef(null);

  // Utility to update filters
  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    // when filter changes, reset to page 1
    setCurrentPage(1);
  };

  const handleSelectSubcatIds = (id) => {
    setSubcategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setCurrentPage(1);
  };

  // Stable function to fetch posts (keeps behaviour same as getRequest(url))
  const getAllPosts = useCallback(async (url) => {
    setLoading(true);
    try {
      const response = await getRequest(url);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setAllPosts(response?.data?.data?.posts || []);
        setTotalCounts(response?.data?.data?.totalCount || 0);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch categories/subcategories
  const getAllSubcategory = useCallback(async (url) => {
    try {
      const response = await getRequest(url);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setAllSubCategory(response?.data?.data?.subCategories || []);
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  }, []);

  const getAllCategory = useCallback(async (url) => {
    try {
      const response = await getRequest(url);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setAllCategory(response?.data?.data?.categories || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  // Build filter object deterministically
  const buildFilterObject = useCallback(() => {
    const filterObj = {};

    if (filters.category) filterObj.category_id = Number(filters.category);
    if (subcategoryIds?.length) filterObj.sub_category_id = subcategoryIds;
    if (debouncedPriceRange?.[0]) filterObj.price_min = debouncedPriceRange[0];
    if (debouncedPriceRange?.[1]) filterObj.price_max = debouncedPriceRange[1];

    if (filters.city) filterObj.city = filters.city;
    if (filters.type) filterObj.post_type = filters.type;
    if (searchTextDebounce) filterObj.search = searchTextDebounce;

    // If location.state has a searchText and we haven't used it yet, include it.
    if (location?.state?.searchText && hasUsedSearchText.current) {
      // include as searchtext so API will respect whatever old flow expected
      filterObj.searchtext = location.state.searchText;
    }

    return filterObj;
  }, [
    filters,
    subcategoryIds,
    searchTextDebounce,
    location?.state?.searchText,
  ]);

  // Create the full URL from page and filters
  const buildUrlForRequest = useCallback(
    (page = currentPage) => {
      const filterObj = buildFilterObject();
      let url = `${POST.GET_ALL}?page=${page}&limit=12`;
      if (Object.keys(filterObj).length > 0) {
        url += `&filters=${encodeURIComponent(JSON.stringify(filterObj))}`;
      }
      return url;
    },
    [buildFilterObject, currentPage]
  );

  // Main effect: watch the values that should trigger fetching posts.
  // We create a requestKey (string) and skip the request if it matches lastRequestKeyRef.
  useEffect(() => {
    // create a key representing this request's parameters (includes page)
    const filterObj = buildFilterObject();
    const requestKey = JSON.stringify({
      page: currentPage,
      filters: filterObj,
      token: accessToken ? "auth" : "noauth", // include auth presence if results differ
    });

    if (lastRequestKeyRef.current === requestKey) {
      // same request as last time — skip to avoid duplicate call
      return;
    }

    lastRequestKeyRef.current = requestKey;
    const url = buildUrlForRequest(currentPage);
    getAllPosts(url);
  }, [
    currentPage,
    filters,
    subcategoryIds,
    searchTextDebounce,
    accessToken,
    buildFilterObject,
    buildUrlForRequest,
    getAllPosts,
  ]);

  // Handle location.state.searchText exactly once and set the debounced value.
  // This avoids the old double-call where we set searchText AND navigated immediately.
  useEffect(() => {
    if (location.state?.searchText) {
      // mark that we used location state so buildFilterObject may include it if needed
      hasUsedSearchText.current = true;

      // set both immediate text (so UI shows it) and the debounced value (so API will use it)
      setSearchText(location.state.searchText);
      setSearchTextDebounce(location.state.searchText);

      // clear the location.state so the route is clean for back/refresh
      // navigation replace will not create an extra push
      navigate(location.pathname, { replace: true, state: {} });
    }
    // only run once on mount-like behavior for location.state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run only once on mount

  // When any filter/subcategory/page changes while we had used location searchtext,
  // clear the "used" flag and clear UI searchText (to match prior behavior)
  useEffect(() => {
    if (
      hasUsedSearchText.current &&
      (filters.category ||
        filters.city ||
        filters.type ||
        subcategoryIds?.length ||
        currentPage > 1)
    ) {
      // user changed filters after arriving via location search; clear location usage
      hasUsedSearchText.current = false;
      setSearchText("");
      setSearchTextDebounce(""); // also clear the debounced value
      // ensure the URL is clean
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, subcategoryIds, currentPage]);

  // when categories are needed, fetch them once at mount
  useEffect(() => {
    getAllSubcategory(CUSTOMER.GET_ALL_SUBCATEGORY);
    getAllCategory(CUSTOMER.CATEGORY_LIST);
  }, [getAllSubcategory, getAllCategory]);

  // If location.state.categoryName is provided, set the corresponding category filter once categories loaded
  useEffect(() => {
    if (location?.state?.categoryName && allCategory?.length) {
      const matchedId = allCategory.find(
        (cat) => String(cat.name) === String(location.state.categoryName)
      )?.id;

      if (matchedId) {
        setFilters((prev) => ({
          ...prev,
          category: matchedId,
        }));
      }
      // clear it from history/state so we don't re-process
      navigate(location.pathname, { replace: true, state: {} });
    }
    // only run when category list or location.state.categoryName changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.state?.categoryName, allCategory]);

  // Like/unlike handler — kept almost same, but we re-fetch after success
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
        // refresh current data by calling same request key (invalidate lastRequestKeyRef)
        lastRequestKeyRef.current = null;
        const urlForCurrent = buildUrlForRequest(currentPage);
        getAllPosts(urlForCurrent);
      } else {
        showErrorToast("Unable to update wishlist");
      }
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message || "Failed to update wishlist"
      );
    }
  };

  console.log("filtersModal", filtersModal);

  return (
    <>
      {loading ? (
        <ScreenLoader />
      ) : (
        <div className="spacer-x">
          <SearchTopFilter
            categories={allSubCategory}
            toggleGrid={toggleGrid}
            setToggleGrid={setToggleGrid}
            handleSelectSubcatIds={handleSelectSubcatIds}
            subcategoryIds={subcategoryIds}
            setFiltersModal={setFiltersModal}
            searchText={searchText}
            setSearchText={setSearchText} // allow top filter to set immediate input
            setSearchTextDebounce={setSearchTextDebounce} // allow it to set debounced value directly if needed
            filters={filters}
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
          />

          <LoginModal
            show={showLoginModal}
            hide={() => setShowLoginModal(false)}
            setShowLoginModal={setShowLoginModal}
          />
        </div>
      )}
    </>
  );
};

export default ProductPage;
