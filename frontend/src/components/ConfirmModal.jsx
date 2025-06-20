import React from "react";

const ConfirmModal = ({
  title = "Please Confirm",
  message = "Are you sure?",
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "Cancel",
  confirmButtonColor = "bg-red-500", 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded ${confirmButtonColor}`}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
