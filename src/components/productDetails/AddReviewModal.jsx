import React, { useState } from "react";
import { CUSTOMER } from "../../config/endPoints";
import { postRequest } from "../../config/apiFunctions";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import { useTranslation } from "react-i18next";
import LoadingButton from "../../common/loadingButton/LoadingButton";
import { useParams } from "react-router-dom";

export const AddReviewModal = ({ onClose, postDetailData }) => {
  const { i18n, t } = useTranslation();
  const { id } = useParams();
  const [rating, setRating] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === "") {
      showErrorToast(t("addStars"));
    } else {
      const payload = {
        seller_id: postDetailData?.user?.userid,
        listing_id: id,
        rating: rating,
        review_text: feedback,
      };
      try {
        const response = await postRequest(CUSTOMER.CREATE_REVIEW, payload);
        if (response?.data?.success && response?.data?.statusCode === 200) {
          showSuccessToast(response?.data?.message);
          onClose();
          setFeedback("");
          setRating("");
          setLoading(false);
        }
      } catch (error) {
        showErrorToast(error?.response?.data?.message);
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className={`absolute top-4 text-gray-400 hover:text-gray-600 ${
            i18n.language === "ar" ? "left-6" : "right-6"
          }`}
        >
          <i className="fa-solid fa-xmark fa-lg" />
        </button>

        <h2 className="text-xl font-bold mb-4">{t("addReview")}</h2>

        <hr className="border-gray-300" />

        <div className="flex justify-center my-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              className="mx-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill={star <= rating ? "orange" : "lightgray"}
                className="w-10 h-10"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.383 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.383-2.46a1 1 0 00-1.176 0l-3.383 2.46c-.784.57-1.838-.196-1.539-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
              </svg>
              <p className="text-center text-sm mt-1">{star}</p>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-bold mb-2">
            {t("tellMore")}{" "}
            <span className="text-gray-400">{t("optional")}</span>
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={6}
            className="w-full bg-gray-100 rounded-lg p-3 text-sm mb-4 outline-none resize-none"
            placeholder={t("writeFeedback")}
          />

          <LoadingButton
            type="submit"
            loading={loading}
            disabled={loading}
            className="bg-primary text-white hover:bg-primaryDark"
          >
            {t("submit")}
          </LoadingButton>
        </form>
      </div>
    </div>
  );
};
