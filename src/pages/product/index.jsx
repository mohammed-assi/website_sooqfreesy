import React, { useEffect, useRef, useState } from "react";
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
  const totalPages = Math.ceil(totalCount / 12);
  const [filtersModal, setFiltersModal] = useState({});
  const [searchText, setSearchText] = useState("");
  const hasUsedSearchText = useRef(false);
  const [filters, setFilters] = useState({
    city: "",
    type: "",
    category: "",
    priceRange: [0, 0],
  });
  const [searchTextDebounce, setSearchTextDebounce] = useSearchDebounce();

  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSelectSubcatIds = (id) => {
    setSubcategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getAllPosts = async (url) => {
    setLoading(true);
    try {
      const response = await getRequest(url);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setAllPosts(response?.data?.data?.posts);
        setTotalCounts(response?.data?.data?.totalCount);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setLoading(false);
    }
    setLoading(false);
  };

  const getAllSubcategory = async (url) => {
    try {
      const response = await getRequest(url);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setAllSubCategory(response?.data?.data?.subCategories);
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
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

  const getAllPostsCallBack = () => {
    const filterObj = {};

    if (filters.category) filterObj.category_id = Number(filters.category);
    if (subcategoryIds?.length) filterObj.sub_category_id = subcategoryIds;
    if (filters.priceRange?.[0]) filterObj.price_min = filters.priceRange[0];
    if (filters.priceRange?.[1]) filterObj.price_max = filters.priceRange[1];
    if (filters.city) filterObj.city = filters.city;
    if (filters.type) filterObj.post_type = filters.type;
    if (searchTextDebounce) filterObj.search = searchTextDebounce;

    if (location?.state?.searchText) {
      filterObj.searchtext = location?.state?.searchText;
      hasUsedSearchText.current = true;
    }

    let url = `${POST.GET_ALL}?page=${currentPage}&limit=12`;

    if (Object.keys(filterObj).length > 0) {
      url += `&filters=${encodeURIComponent(JSON.stringify(filterObj))}`;
    }

    getAllPosts(url);
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
    if (location.state?.searchText) {
      setSearchText(location.state.searchText);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    getAllPostsCallBack();
  }, [
    currentPage,
    filters,
    subcategoryIds,
    searchText,
    accessToken,
    searchTextDebounce,
  ]);

  useEffect(() => {
    if (
      hasUsedSearchText.current &&
      (filters.category ||
        filters.city ||
        filters.type ||
        subcategoryIds?.length ||
        currentPage > 1)
    ) {
      navigate(location.pathname, { replace: true, state: {} });
      setSearchText("");
      hasUsedSearchText.current = false;
    }
  }, [filters, subcategoryIds, currentPage]);

  useEffect(() => {
    getAllSubcategory(CUSTOMER.GET_ALL_SUBCATEGORY);
    getAllCategory(CUSTOMER.CATEGORY_LIST);
  }, []);

  useEffect(() => {
    if (location?.state?.categoryName && allCategory?.length) {
      const matchedId = allCategory.find(
        (cat) => cat.name === location.state.categoryName
      )?.id;

      if (matchedId) {
        setFilters((prev) => ({
          ...prev,
          category: matchedId,
        }));
      }
    }
  }, [location?.state?.categoryName, allCategory]);


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
