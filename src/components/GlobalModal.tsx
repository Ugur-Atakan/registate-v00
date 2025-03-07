import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import { useEffect } from "react";
import Modal from "react-modal";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { hideModal } from "../store/slices/commonSlice";

interface ModalContent {
    type: "Error" | "Success";
    title: string;
    description: string;
  }
  

const GlobalModal = () => {
  const {visible, content, autoHide} = useAppSelector(
    state => state.common.modal,
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (autoHide && visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [visible, autoHide]);


  const onClose = () => {
    dispatch(hideModal());
  };

  return (
    <Modal
      isOpen={visible}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40"
    >
      <div className="bg-white rounded-2xl shadow-lg p-6 w-80 text-center">
        {content?.type === "Error" ? (
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto" />
        ) : (
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
        )}
        <h2 className="text-lg font-bold text-gray-800 mt-4">{content?.title}</h2>
        <p className="text-sm text-gray-600 mt-2">{content?.description}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-lg w-full hover:bg-gray-700 transition"
        >
          OK
        </button>
      </div>
    </Modal>
  );
};

export default GlobalModal;
