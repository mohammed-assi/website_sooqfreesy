import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { deleteRequest, getRequest } from "../../../config/apiFunctions";
import { POST } from "../../../config/endPoints";
import { ScreenLoader } from "../../../utils/screenLoader";
import MyAdsCard from "./section/MyAdsCard";
import { DeleteModal } from "./section/DeleteModal";
import { InfoModal } from "../../../common/modal/InfoModal";
import { showErrorToast, showSuccessToast } from "../../../utils/toastUtils";
import { useSelector } from "react-redux";

export const MyAds = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const imagePath = import.meta.env.VITE_APP_IMAGE_URL;
  const currency = useSelector((state) => state.currency.value);

  const [allPosts, setAllPosts] = useState([]);
  const [postcounts, setPostCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteInfoModal, setShowDeleteInfoModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const tabs = [
    {
      id: 0,
      label: `${t("inactive")} (${postcounts?.UNAPPROVED})`,
    },
    {
      id: 1,
      label: `${t("active")} (${postcounts?.APPROVED})`,
    },
    { id: 3, label: `${t("sold")} (${postcounts?.SOLD})` },
    { id: 2, label: `${t("reject")} (${postcounts?.REJECTED})` },
  ];

  const handleOpenDeleteModal = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };

  const handleDeletePost = async () => {
    setDeleteLoading(true);
    try {
      const res = await deleteRequest(`${POST.DELETE}/${deleteId}`);

      if (res?.data?.statusCode === 200) {
        showSuccessToast(res?.data?.message);
        setShowDeleteInfoModal(true);
        setDeleteLoading(false);
        getAllPostsCallBack();
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
      setDeleteLoading(false);
    }
    setDeleteLoading(false);
  };

  const handleMarkSoldPost = async (id) => {
    try {
      const res = await getRequest(`${POST.MARK_SOLD}?listing_id=${id}`);

      if (res?.data?.statusCode === 200) {
        showSuccessToast(res?.data?.message);
        getAllPostsCallBack();
        setActiveTab(3);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    }
  };

  const getAllPosts = async (url) => {
    setLoading(true);
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      setPostCounts(response?.data?.data?.statusCounts);
      setAllPosts(response?.data?.data?.posts);
      setLoading(false);
    }
    setLoading(false);
  };

  const getAllPostsCallBack = () => {
    getAllPosts(`${POST.GET_MYADS}?status=${activeTab}`);
  };

  useEffect(() => {
    getAllPostsCallBack();
  }, [activeTab, currency]);

  return (
    <>
      {loading ? (
        <ScreenLoader />
      ) : (
        <div className="lg:p-5">
          <h1 className="main-heading">{t("myAds")}</h1>

          <div className="flex py-8">
            {tabs.map((tab) => (
              <p
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative cursor-pointer pb-2 px-4 md:px-10 text-sm md:text-lg font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                {tab.label}
                <span
                  className={`absolute left-0 -bottom-[1px] h-[1px] w-full rounded-full transition-colors ${
                    activeTab === tab.id ? "bg-primary h-[2px]" : "bg-gray-300"
                  }`}
                />
              </p>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {allPosts?.length > 0 ? (
              allPosts.map((item) => (
                <MyAdsCard
                  key={item.id}
                  item={item}
                  imagePath={imagePath}
                  handleOpenDeleteModal={handleOpenDeleteModal}
                  handleMarkSoldPost={handleMarkSoldPost}
                  activeTab={activeTab}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 font-medium py-6">
                {t("noDataFound")}
              </p>
            )}
          </div>
        </div>
      )}

      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          handleDeletePost={handleDeletePost}
          loading={deleteLoading}
        />
      )}

      {showDeleteInfoModal && (
        <InfoModal
          onClose={() => {
            setShowDeleteInfoModal(false);
            setShowDeleteModal(false);
          }}
          title={t("postDeleted")}
          subtitle={t("postDeletedSubtitle")}
        />
      )}
    </>
  );
};
