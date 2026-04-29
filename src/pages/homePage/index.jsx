import { useEffect, useState } from "react";
import { Banner } from "../../components/Home/Banner";
import { GetApplications } from "../../components/Home/GetApplications";
import { ImageSlider } from "../../components/Home/ImageSlider";
import { Products } from "../../components/Home/Products";
import { getRequest } from "../../config/apiFunctions";
import { CONTENT, CUSTOMER, POST } from "../../config/endPoints";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import LoginModal from "../../components/auth/LoginModal";
import { useDispatch, useSelector } from "react-redux";
import { ScreenLoader } from "../../utils/screenLoader";
import { setNotifications } from "../../redux/slices/notificationSlice";
import { useTranslation } from "react-i18next";
import { LOCAL_STORAGE } from "../../config/constants";
import Catbar from "../../components/Home/Catbar";
import parse from "html-react-parser";

export const HomePage = () => {
  const { t } = useTranslation();
  const imagePath = import.meta.env.VITE_APP_IMAGE_URL;
  const currency = useSelector((state) => state.currency.value);
  const viewPostIds =
    JSON.parse(localStorage.getItem(LOCAL_STORAGE.RECENT_VIEWS)) || [];
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);

  const [postsLoading, setPostsLoading] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("worldwide");
  const reduxCoords = useSelector((state) => state.location.coords);
  const [allCategory, setAllCategory] = useState([]);
  const [pageData, setPageData] = useState({});
  const [welcomeData, setWelcomeData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  const getWelcomeData = async (url) => {
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      setWelcomeData(response?.data?.data?.content);
    }
  };

  useEffect(() => {
    getWelcomeData(`${CONTENT.GET}?type=WELCOME`);
  }, []);

  const getPageData = async (url) => {
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      setPageData(response?.data?.data);
    }
  };

  useEffect(() => {
    getPageData(`${CUSTOMER.BANNER_IMAGES}`);
  }, []);

  const tabs = [
    { id: "worldwide", label: t("worldwide") },
    { id: "nearby", label: t("nearby") },
    { id: "forYou", label: t("forYou") },
  ];

  // const getAllPosts = async (url) => {
  //   setPostsLoading(true);
  //   try {
  //     const response = await getRequest(url);
  //     if (response?.data?.success && response?.data?.statusCode === 200) {
  //       setAllPosts(response?.data?.data?.posts || []);
  //     } else {
  //       setAllPosts([]);
  //     }
  //   } catch (err) {
  //     setAllPosts([]);
  //     console.error("Error fetching posts:", err);
  //   } finally {
  //     setPostsLoading(false);
  //   }
  // };

  // const getAllPostsCallBack = () => {
  //   let filters = {};

  //   if (activeTab === "forYou") {
  //     filters = { foryou: true, listingIds: viewPostIds };
  //   } else if (activeTab === "nearby") {
  //     filters = {
  //       latitude: reduxCoords?.lat || "",
  //       longitude: reduxCoords?.lng || "",
  //       nearby: true,
  //     };
  //   }
  //   const queryString = Object.keys(filters).length
  //     ? `&filters=${encodeURIComponent(JSON.stringify(filters))}`
  //     : "";

  //   const url = `${POST.GET_ALL}?page=1&limit=8${queryString}`;
  //   getAllPosts(url);
  // };

  // const handleLikeUnlikePost = async (data) => {
  //   setPostsLoading(true);
  //   if (accessToken) {
  //     let url;
  //     if (data?.isWishlisted) {
  //       url = POST.UNLIKE;
  //     } else {
  //       url = POST.LIKE;
  //     }
  //     try {
  //       const response = await getRequest(`${url}?listingId=${data?.id}`);
  //       if (response?.data?.success && response?.data?.statusCode === 200) {
  //         showSuccessToast(response?.data?.message);
  //         getAllPostsCallBack();
  //         const res = await getRequest(CUSTOMER.NOTIFICTIN_COUNT);
  //         if (res?.data?.success && res?.data?.statusCode === 200) {
  //           dispatch(setNotifications(res?.data?.data));
  //         }
  //       }
  //     } catch (error) {
  //       showErrorToast(error?.response?.data?.message);
  //     } finally {
  //       setPostsLoading(false);
  //     }
  //   } else {
  //     setShowLoginModal(true);
  //     setPostsLoading(false);
  //   }
  // };

  const getAllPosts = async (page = 1) => {
    setPostsLoading(true);
    try {
      // build filters same as before
      let filters = {};
      if (activeTab === "forYou") {
        filters = { foryou: true, listingIds: viewPostIds };
      } else if (activeTab === "nearby") {
        filters = {
          latitude: reduxCoords?.lat || "",
          longitude: reduxCoords?.lng || "",
          nearby: true,
        };
      }
      const queryString = Object.keys(filters).length
        ? `&filters=${encodeURIComponent(JSON.stringify(filters))}`
        : "";

      const url = `${POST.GET_ALL}?page=${page}&limit=${limit}${queryString}`;
      const response = await getRequest(url);

      if (response?.data?.success && response?.data?.statusCode === 200) {
        // posts
        const posts = response?.data?.data?.posts || [];
        setAllPosts(posts);

        const totalCount = response?.data?.data?.totalCount;

        const totalPagesFromApi = Math.ceil((totalCount ?? 0) / limit);

        console.log("totalPagesFromApi", totalPagesFromApi);

        setTotalPages(totalPagesFromApi || 1);
      } else {
        setAllPosts([]);
        setTotalPages(1);
      }
    } catch (err) {
      setAllPosts([]);
      setTotalPages(1);
      console.error("Error fetching posts:", err);
    } finally {
      setPostsLoading(false);
    }
  };

  // wrapper used earlier; now we call getAllPosts directly when needed
  // const getAllPostsCallBack = () => {
  //   getAllPosts(currentPage);
  // };

  // fetch posts when these deps change (including page)
  useEffect(() => {
    getAllPosts(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, activeTab, currency, reduxCoords, currentPage]);

  // reset page to 1 when activeTab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleLikeUnlikePost = async (data) => {
    setPostsLoading(true);
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
          // re-fetch current page after like/unlike
          getAllPosts(currentPage);
          const res = await getRequest(CUSTOMER.NOTIFICTIN_COUNT);
          if (res?.data?.success && res?.data?.statusCode === 200) {
            dispatch(setNotifications(res?.data?.data));
          }
        }
      } catch (error) {
        showErrorToast(error?.response?.data?.message);
      } finally {
        setPostsLoading(false);
      }
    } else {
      setShowLoginModal(true);
      setPostsLoading(false);
    }
  };

  const getAllCategory = async (url) => {
    try {
      const response = await getRequest(url);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setAllCategory(response?.data?.data?.categories || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    getAllCategory(CUSTOMER.CATEGORY_LIST);
  }, []);

  // useEffect(() => {
  //   getAllPostsCallBack();
  // }, [accessToken, activeTab, currency, reduxCoords]);

  if (postsLoading && !allPosts?.length) {
    return <ScreenLoader />;
  }

  console.log("totalPages", totalPages);

  return (
    <>
      {postsLoading ? (
        <ScreenLoader />
      ) : (
        <>
          <Banner allCategory={allCategory} imagePath={imagePath} />
          {/* <section className="hidden md:block">
            <ImageSlider pageData={pageData} imagePath={imagePath} />
          </section> */}
          <Products
            allPosts={allPosts}
            imagePath={imagePath}
            handleLikeUnlikePost={handleLikeUnlikePost}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            tabs={tabs}
            postsLoading={postsLoading}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          <section className="hidden md:block">
            <ImageSlider pageData={pageData} imagePath={imagePath} />
          </section>
          <div className="spacer-x pb-15 md:pb-20 pt-12 md:pt-5">
            <h3 className="main-heading">{welcomeData[0]?.title}</h3>
            <p className="text-gray-500">
              {parse(`${welcomeData[0]?.description}`)}
            </p>
          </div>
          <GetApplications />

          <LoginModal
            show={showLoginModal}
            hide={() => setShowLoginModal(false)}
            setShowLoginModal={setShowLoginModal}
          />
        </>
      )}
    </>
  );
};
