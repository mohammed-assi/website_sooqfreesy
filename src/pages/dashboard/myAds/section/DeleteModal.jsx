import { useTranslation } from "react-i18next";
import LoadingButton from "../../../../common/loadingButton/LoadingButton";
export const DeleteModal = ({ onClose, loading, handleDeletePost }) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className=" flex flex-col items-center justify-center">
          <h3 className="font-bold text-xl pt-6">{t("deleteTitle")}</h3>
        </div>

        <div className="pt-5 flex flex-col gap-3">
          <LoadingButton
            type="button"
            onClick={handleDeletePost}
            loading={loading}
            disabled={loading}
            className="bg-primary text-white text-base hover:bg-primaryDark h-[50px]"
          >
            {t("deleteButton")}
          </LoadingButton>

          <button
            onClick={onClose}
            className="w-full bg-white border-2 border-primary h-[50px] text-primary hover:bg-primary hover:text-white rounded-lg font-medium transition"
          >
            {t("noButton")}
          </button>
        </div>
      </div>
    </div>
  );
};
