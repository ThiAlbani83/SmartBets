import Button from "./Button";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded shadow-lg">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <Button
            onClick={onClose}
            className="px-4 py-2 mr-2 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
