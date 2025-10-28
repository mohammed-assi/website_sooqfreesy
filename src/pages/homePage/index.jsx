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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("worldwide");
  const reduxCoords = useSelector((state) => state.location.coords);
  const [allCategory, setAllCategory] = useState([]);
  const [pageData, setPageData] = useState({});
  const [welcomeData, setWelcomeData] = useState([]);

  const getWelcomeData = async (url) => {
    setLoading(true);
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      setWelcomeData(response?.data?.data?.content);
    }
    setLoading(false);
  };

  useEffect(() => {
    getWelcomeData(`${CONTENT.GET}?type=WELCOME`);
  }, []);

  const getPageData = async (url) => {
    setLoading(true);
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      setPageData(response?.data?.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPageData(`${CUSTOMER.BANNER_IMAGES}`);
  }, []);

  const tabs = [
    { id: "worldwide", label: t("worldwide") },
    { id: "nearby", label: t("nearby") },
    { id: "forYou", label: t("forYou") },
  ];

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

    const url = `${POST.GET_ALL}?page=1&limit=8${queryString}`;
    getAllPosts(url);
  };

  const handleLikeUnlikePost = async (data) => {
    setLoading(true);
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
          setLoading(false);
          const res = await getRequest(CUSTOMER.NOTIFICTIN_COUNT);
          if (res?.data?.success && res?.data?.statusCode === 200) {
            dispatch(setNotifications(res?.data?.data));
          }
        }
      } catch (error) {
        showErrorToast(error?.response?.data?.message);
        setLoading(false);
      }
    } else {
      setShowLoginModal(true);
      setLoading(false);
    }
    setLoading(false);
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

  useEffect(() => {
    getAllPostsCallBack();
  }, [accessToken, activeTab, currency, reduxCoords]);

  console.log("welcomeData", welcomeData);

  return (
    <>
      {loading ? (
        <ScreenLoader />
      ) : (
        <>
          <Banner allCategory={allCategory} imagePath={imagePath} />
          <section className="hidden md:block">
            <ImageSlider pageData={pageData} imagePath={imagePath} />
          </section>
          <Products
            allPosts={allPosts}
            imagePath={imagePath}
            handleLikeUnlikePost={handleLikeUnlikePost}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            tabs={tabs}
          />
          <section className="md:hidden">
            <ImageSlider pageData={pageData} imagePath={imagePath} />
          </section>
          <div className="spacer-x pb-15 md:pb-20 pt-12 md:pt-0">
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
