import React from "react";

interface ModifyProductProps {
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const ModifyProduct: React.FC<ModifyProductProps> = ({ onClose, onConfirm, isLoading }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
        <h2 className="text-xl font-semibold mb-4">Êtes-vous sûr de vouloir modifier ce Produit ?</h2>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="mr-2 rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
            disabled={isLoading}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Modification..." : "Modifier"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifyProduct;