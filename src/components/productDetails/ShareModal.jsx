
export const ShareModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-400 hover:text-gray-600"
        >
          <i className="fa-solid fa-xmark fa-lg" />
        </button>

        <h2 className="text-xl font-bold mb-4">Share Product</h2>

      </div>
    </div>
  );
};
