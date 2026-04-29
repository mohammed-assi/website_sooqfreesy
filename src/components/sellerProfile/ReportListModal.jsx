import { useTranslation } from "react-i18next";

const ReportListModal = ({
  isOpen,
  onClose,
  setShowReportButton,
  reportList,
  setReportId,
  reportId,
  setCustomReason,
  customReason,
  handleSubmit,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="font-bold text-xl">{t("reportSeller")}</h2>

        <div className="space-y-2">
          {reportList.map((item, idx) => (
            <label
              key={idx}
              className="flex items-center gap-3 py-1 cursor-pointer"
            >
              <input
                type="radio"
                name="reportReason"
                value={item.id}
                checked={reportId === item.id}
                onChange={() => setReportId(item.id)}
                className="accent-cyan-500"
              />
              <span className="text-gray-700">{item.name}</span>
            </label>
          ))}
        </div>

        <textarea
          placeholder={t("yourReason")}
          value={customReason}
          onChange={(e) => setCustomReason(e.target.value)}
          className="w-full border-b border-gray-600 p-2 mt-4 focus:outline-none"
        />

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="w-full px-5 py-2 bg-primary text-white rounded-md hover:bg-primaryDark transition"
          >
            {t("submit")}
          </button>
          <button
            onClick={() => {
              onClose();
              setShowReportButton(false);
            }}
            className="w-full px-5 py-2 border border-primary text-cyan-500 rounded-md hover:bg-primary hover:text-white transition"
          >
            {t("cancelButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportListModal;
