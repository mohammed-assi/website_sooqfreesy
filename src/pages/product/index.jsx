import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { SearchTopFilter } from "../../components/searchPage/SearchTopFilter";
import ProductFilter from "../../components/searchPage/ProductFilter";
import { getRequest } from "../../config/apiFunctions";
import { CUSTOMER, POST } from "../../config/endPoints";
import { useLocation, useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import { useDispatch, useSelector } from "react-redux";
import LoginModal from "../../components/auth/LoginModal";
import { ScreenLoader } from "../../utils/screenLoader";
import useSearchDebounce from "../../utils/searchDebounce";
import { City, Country, State } from "country-state-city";
import { setNotifications } from "../../redux/slices/notificationSlice";

export const ProductPage = () => {
  // const location = useLocation();
  // const navigate = useNavigate();
  // const imagePath = import.meta.env.VITE_APP_IMAGE_URL;
  // const { accessToken } = useSelector((state) => state.auth);
  // const [showLoginModal, setShowLoginModal] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [toggleGrid, setToggleGrid] = useState(false);
  // const [allPosts, setAllPosts] = useState([]);
  // const [allCategory, setAllCategory] = useState([]);
  // const [allSubCategory, setAllSubCategory] = useState([]);
  // const [totalCount, setTotalCounts] = useState(0);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [subcategoryIds, setSubcategoryIds] = useState([]);
  // const [filtersModal, setFiltersModal] = useState({});
  // const [searchText, setSearchText] = useState("");
  // const hasUsedSearchText = useRef(false);
  // const [filters, setFilters] = useState({
  //   city: "",
  //   type: "",
  //   category: "",
  //   subCategory: "",
  //   priceRange: [0, 0],
  // });
  // const debouncedPriceRange = useDebounce(filters.priceRange, 800);
  // const [searchTextDebounce, setSearchTextDebounce] = useSearchDebounce();
  // const totalPages = Math.ceil(totalCount / 12);
  // const lastRequestKeyRef = useRef(null);

  // const reduxCoords = useSelector((state) => state.location.coords);

  // const [states, setStates] = useState([]);
  // const [cities, setCities] = useState([]);
  // const [selectedState, setSelectedState] = useState("");
  // const [selectedCity, setSelectedCity] = useState("");
  // const [selectedLocation, setSelectedLocation] = useState("");
  // const [coords, setCoords] = useState({ lat: null, lng: null, country: null });
  // const [subCategoryList, setSubCategoryList] = useState([]);

  // console.log("coords", coords);

  // const handleChange = (key, value) => {
  //   setFilters((prev) => ({
  //     ...prev,
  //     [key]: value,
  //   }));
  //   setCurrentPage(1);
  // };

  // const handleSelectSubcatIds = (id) => {
  //   setSubcategoryIds((prev) =>
  //     prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
  //   );
  //   setCurrentPage(1);
  // };

  // const getAllPosts = useCallback(async (url) => {
  //   setLoading(true);
  //   try {
  //     const response = await getRequest(url);
  //     if (response?.data?.success && response?.data?.statusCode === 200) {
  //       setAllPosts(response?.data?.data?.posts || []);
  //       setTotalCounts(response?.data?.data?.totalCount || 0);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching posts:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // const getAllSubcategory = useCallback(async (url) => {
  //   try {
  //     const response = await getRequest(url);
  //     if (response?.data?.success && response?.data?.statusCode === 200) {
  //       setAllSubCategory(response?.data?.data?.subCategories || []);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching subcategories:", err);
  //   }
  // }, []);

  // const getAllCategory = useCallback(async (url) => {
  //   try {
  //     const response = await getRequest(url);
  //     if (response?.data?.success && response?.data?.statusCode === 200) {
  //       setAllCategory(response?.data?.data?.categories || []);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching categories:", err);
  //   }
  // }, []);

  // const buildFilterObject = useCallback(() => {
  //   const filterObj = {};

  //   if (filters.category) filterObj.category_id = Number(filters.category);
  //   if (subcategoryIds?.length) filterObj.sub_category_id = subcategoryIds;
  //   if (debouncedPriceRange?.[0]) filterObj.price_min = debouncedPriceRange[0];
  //   if (debouncedPriceRange?.[1]) filterObj.price_max = debouncedPriceRange[1];

  //   if (filters.city) filterObj.city = filters.city;
  //   if (filters.type) filterObj.post_type = filters.type;
  //   if (searchTextDebounce) filterObj.search = searchTextDebounce;

  //   if (location?.state?.searchText && hasUsedSearchText.current) {
  //     filterObj.searchtext = location.state.searchText;
  //   }

  //   return filterObj;
  // }, [
  //   filters,
  //   subcategoryIds,
  //   searchTextDebounce,
  //   location?.state?.searchText,
  // ]);

  // const buildUrlForRequest = useCallback(
  //   (page = currentPage) => {
  //     const filterObj = buildFilterObject();
  //     let url = `${POST.GET_ALL}?page=${page}&limit=12`;
  //     if (Object.keys(filterObj).length > 0) {
  //       url += `&filters=${encodeURIComponent(JSON.stringify(filterObj))}`;
  //     }
  //     return url;
  //   },
  //   [buildFilterObject, currentPage]
  // );

  // useEffect(() => {
  //   const filterObj = buildFilterObject();
  //   const requestKey = JSON.stringify({
  //     page: currentPage,
  //     filters: filterObj,
  //     token: accessToken ? "auth" : "noauth",
  //   });

  //   if (lastRequestKeyRef.current === requestKey) {
  //     return;
  //   }

  //   lastRequestKeyRef.current = requestKey;
  //   const url = buildUrlForRequest(currentPage);
  //   getAllPosts(url);
  // }, [
  //   currentPage,
  //   filters,
  //   subcategoryIds,
  //   searchTextDebounce,
  //   accessToken,
  //   buildFilterObject,
  //   buildUrlForRequest,
  //   getAllPosts,
  // ]);

  // useEffect(() => {
  //   if (location.state?.searchText) {
  //     hasUsedSearchText.current = true;
  //     setSearchText(location.state.searchText);
  //     setSearchTextDebounce(location.state.searchText);
  //     navigate(location.pathname, { replace: true, state: {} });
  //   }
  // }, []);
  // useEffect(() => {
  //   if (
  //     hasUsedSearchText.current &&
  //     (filters.category ||
  //       filters.city ||
  //       filters.type ||
  //       subcategoryIds?.length ||
  //       currentPage > 1)
  //   ) {
  //     hasUsedSearchText.current = false;
  //     setSearchText("");
  //     setSearchTextDebounce("");
  //     navigate(location.pathname, { replace: true, state: {} });
  //   }
  // }, [filters, subcategoryIds, currentPage]);

  // useEffect(() => {
  //   getAllSubcategory(CUSTOMER.GET_ALL_SUBCATEGORY);
  //   getAllCategory(CUSTOMER.CATEGORY_LIST);
  // }, [getAllSubcategory, getAllCategory]);

  // useEffect(() => {
  //   if (location?.state?.categoryName && allCategory?.length) {
  //     const matchedId = allCategory.find(
  //       (cat) => String(cat.name) === String(location.state.categoryName)
  //     )?.id;

  //     if (matchedId) {
  //       setFilters((prev) => ({
  //         ...prev,
  //         category: matchedId,
  //       }));
  //     }
  //     navigate(location.pathname, { replace: true, state: {} });
  //   }
  // }, [location?.state?.categoryName, allCategory]);

  // const handleLikeUnlikePost = async (data) => {
  //   if (!accessToken) {
  //     setShowLoginModal(true);
  //     return;
  //   }

  //   const url = data?.isWishlisted ? POST.UNLIKE : POST.LIKE;

  //   try {
  //     const response = await getRequest(`${url}?listingId=${data?.id}`);
  //     if (response?.data?.success && response?.data?.statusCode === 200) {
  //       showSuccessToast(response?.data?.message || "Updated wishlist");
  //       lastRequestKeyRef.current = null;
  //       const urlForCurrent = buildUrlForRequest(currentPage);
  //       getAllPosts(urlForCurrent);
  //     } else {
  //       showErrorToast("Unable to update wishlist");
  //     }
  //   } catch (error) {
  //     showErrorToast(
  //       error?.response?.data?.message || "Failed to update wishlist"
  //     );
  //   }
  // };

  // useEffect(() => {
  //   if (reduxCoords?.country) {
  //     const countryObj = Country.getAllCountries().find(
  //       (c) => c.name === reduxCoords.country
  //     );

  //     if (countryObj) {
  //       const stateList = State.getStatesOfCountry(countryObj.isoCode);
  //       setStates(stateList);
  //       setSelectedState("");
  //       setCities([]);
  //       setSelectedCity("");
  //     }
  //   }
  // }, [reduxCoords?.country]);

  // useEffect(() => {
  //   if (selectedState) {
  //     const cityList = City.getCitiesOfState(
  //       states.find((s) => s.name === selectedState)?.countryCode,
  //       states.find((s) => s.name === selectedState)?.isoCode
  //     );
  //     setCities(cityList);
  //     setSelectedCity("");
  //   }
  // }, [selectedState, states]);

  // const getSubCategory = async (url) => {
  //   try {
  //     const response = await getRequest(url);
  //     if (response?.data?.success && response?.data?.statusCode === 200) {
  //       setSubCategoryList(response?.data?.data);
  //     }
  //   } catch (error) {
  //     showErrorToast(error?.response?.data?.message);
  //   }
  // };

  // useEffect(() => {
  //   if (filters?.category) {
  //     getSubCategory(`${CUSTOMER.GET_SUBCATEGORY}/${filters?.category}`);
  //   }
  // }, [filters?.category]);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const [searchText, setSearchText] = useState("");
  const hasUsedSearchText = useRef(false);
  const [filters, setFilters] = useState({
    city: "",
    type: "",
    category: "",
    subCategory: "",
    priceRange: [0, 0],
  });
  const [searchTextDebounce, setSearchTextDebounce] = useSearchDebounce();

  const totalPages = Math.ceil(totalCount / 12);
  const lastRequestKeyRef = useRef(null);
  const requestTimerRef = useRef(null);

  const reduxCoords = useSelector((state) => state.location.coords);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [coords, setCoords] = useState({ lat: null, lng: null, country: null });
  const [subCategoryList, setSubCategoryList] = useState([]);
  // const hasInitialized = useRef(false);

  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const handleSelectSubcatIds = (id) => {
    setSubcategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setCurrentPage(1);
  };

  const getAllPosts = useCallback(async (url) => {
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
      setLoading(false);
    }
  }, []);

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
  const getSubCategory = async (url) => {
    try {
      const response = await getRequest(url);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setSubCategoryList(response?.data?.data || []);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    }
  };

  const buildFilterObject = useCallback(() => {
    const filterObj = {};
    if (filters.category) filterObj.category_id = Number(filters.category);

    if (filters.subCategory)
      filterObj.sub_category = Number(filters.subCategory);

    if (subcategoryIds?.length) filterObj.sub_category_id = subcategoryIds;

    if (filters.priceRange?.[0]) filterObj.price_min = filters.priceRange[0];
    if (filters.priceRange?.[1]) filterObj.price_max = filters.priceRange[1];

    if (reduxCoords?.country) filterObj.country = reduxCoords?.country;

    if (selectedCity) filterObj.city = selectedCity;
    else if (filters.city) filterObj.city = filters.city;

    if (filters.type) filterObj.post_type = filters.type;

    if (searchTextDebounce) filterObj.searchtext = searchTextDebounce;

    if (location?.state?.searchText && hasUsedSearchText.current) {
      filterObj.search = location.state.searchText;
    }
    if (selectedState) filterObj.state = selectedState;
    if (coords?.lat) filterObj.latitude = Number(coords.lat);
    if (coords?.lng) filterObj.longitude = Number(coords.lng);

    return filterObj;
  }, [
    filters,
    subcategoryIds,
    searchTextDebounce,
    location?.state?.searchText,
    filtersModal,
    selectedCity,
    selectedState,
    coords,
    reduxCoords,
  ]);

  const buildUrlForRequest = useCallback(
    (page = currentPage, applySortingPrice = false) => {
      const filterObj = buildFilterObject();
      let url = `${POST.GET_ALL}?page=${page}&limit=12`;

      if (applySortingPrice) {
        const sorting =
          filtersModal?.sorting === "relevant" ? "relevant" : "newest";
        const byPrice = filtersModal?.price === "lowest" ? "lowest" : "highest";
        url += `&sorting=${sorting}&byPrice=${byPrice}`;
      }

      if (Object.keys(filterObj).length > 0) {
        url += `&filters=${encodeURIComponent(JSON.stringify(filterObj))}`;
      }

      return url;
    },
    [buildFilterObject, currentPage, filtersModal]
  );

  useEffect(() => {
    // if (!hasInitialized.current) {
    //   hasInitialized.current = true;
    //   return;
    // }

    if (requestTimerRef.current) {
      clearTimeout(requestTimerRef.current);
      requestTimerRef.current = null;
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
    }, 1000);

    return () => {
      if (requestTimerRef.current) {
        clearTimeout(requestTimerRef.current);
        requestTimerRef.current = null;
      }
    };
  }, [
    currentPage,
    filters,
    subcategoryIds,
    searchTextDebounce,
    accessToken,
    buildFilterObject,
    buildUrlForRequest,
    getAllPosts,
    selectedCity,
    selectedState,
    coords,
  ]);

  useEffect(() => {
    const fetchInitialPosts = () => {
      const filterObj = buildFilterObject();

      let url =
        Object.keys(filterObj).length === 0
          ? `${POST.GET_ALL}?page=1&limit=12`
          : buildUrlForRequest(1, false);

      getAllPosts(url);
    };

    fetchInitialPosts();
  }, []);

  useLayoutEffect(() => {
    if (location.state?.searchText) {
      hasUsedSearchText.current = true;
      setSearchText(location.state.searchText);
      setSearchTextDebounce(location.state.searchText);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate, setSearchTextDebounce]);

  const handleApplyFilters = () => {
    const url = buildUrlForRequest(currentPage, true);
    getAllPosts(url);
  };

  // useEffect(() => {
  //   if (location.state?.searchText) {
  //     hasUsedSearchText.current = true;
  //     setSearchText(location.state.searchText);
  //     setSearchTextDebounce(location.state.searchText);
  //     navigate(location.pathname, { replace: true, state: {} });
  //   }
  // }, []);

  useEffect(() => {
    if (
      hasUsedSearchText.current &&
      (filters.category ||
        filters.city ||
        filters.type ||
        subcategoryIds?.length ||
        currentPage > 1 ||
        filters.subCategory)
    ) {
      hasUsedSearchText.current = false;
      setSearchText("");
      setSearchTextDebounce("");
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [
    filters,
    subcategoryIds,
    currentPage,
    setSearchTextDebounce,
    navigate,
    location.pathname,
  ]);

  useEffect(() => {
    getAllSubcategory(CUSTOMER.GET_ALL_SUBCATEGORY);
    getAllCategory(CUSTOMER.CATEGORY_LIST);
  }, [getAllSubcategory, getAllCategory]);

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
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location?.state?.categoryName, allCategory, navigate, location.pathname]);

  useEffect(() => {
    if (filters?.category) {
      getSubCategory(`${CUSTOMER.GET_SUBCATEGORY}/${filters?.category}`);
    } else {
      setSubCategoryList([]);
    }
  }, [filters?.category]);

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
      const stateObj = states.find((s) => s.name === selectedState);
      if (stateObj) {
        const cityList = City.getCitiesOfState(
          stateObj.countryCode,
          stateObj.isoCode
        );
        setCities(cityList);
        setSelectedCity("");
      }
    }
  }, [selectedState, states]);

  console.log("location", location);

  if (loading) return <ScreenLoader />;

  return (
    <>
      <div className="spacer-x">
        <SearchTopFilter
          categories={allSubCategory}
          toggleGrid={toggleGrid}
          setToggleGrid={setToggleGrid}
          handleSelectSubcatIds={handleSelectSubcatIds}
          subcategoryIds={subcategoryIds}
          setFiltersModal={setFiltersModal}
          searchText={searchText}
          setSearchText={setSearchText}
          setSearchTextDebounce={setSearchTextDebounce}
          filters={filters}
          handleApplyFilters={handleApplyFilters}
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
        />

        <LoginModal
          show={showLoginModal}
          hide={() => setShowLoginModal(false)}
          setShowLoginModal={setShowLoginModal}
        />
      </div>
    </>
  );
};

export default ProductPage;
