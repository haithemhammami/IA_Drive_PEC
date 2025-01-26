"use client";

import React, { useState, useEffect } from "react";

export interface Product {
  id: number;
  name: string;
  category?: string;
}

export interface SelectProductProps {
  products?: Product[];
  selectedProduct?: Product | null;
  onProductChange?: (product: Product) => void;
}

const SelectProduct: React.FC<SelectProductProps> = ({
  products: propProducts,
  selectedProduct,
  onProductChange,
}) => {
  const [products, setProducts] = useState<Product[]>(propProducts || []);
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<number | "">("");

  // Fetch products if not provided via props
  useEffect(() => {
    if (propProducts) {
      setProducts(propProducts);
    } else {
      const fetchProducts = async () => {
        try {
          const response = await fetch("/api/products");
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des produits");
          }
          const data = await response.json();
          setProducts(data);
        } catch (error) {
          console.error("Erreur :", error);
        }
      };

      fetchProducts();
    }
  }, [propProducts]);

  // Update selected value if a product is pre-selected
  useEffect(() => {
    if (selectedProduct) {
      setSelectedValue(selectedProduct.id);
      setIsOptionSelected(true);
    }
  }, [selectedProduct]);

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number.parseInt(e.target.value);
    setSelectedValue(selectedId);

    const selectedProduct = products.find((product) => product.id === selectedId);
    if (selectedProduct) {
      if (onProductChange) {
        onProductChange(selectedProduct);
      }
      setIsOptionSelected(true);
    }
  };

  return (
    <div className="">
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        Sélectionner un Produit
      </label>

      <div className="relative z-20 bg-transparent dark:bg-dark-2">
        <select
          value={selectedValue}
          onChange={handleSelectionChange}
          className={`relative z-20 w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary ${
            isOptionSelected ? "text-dark dark:text-white" : ""
          }`}
        >
          <option value="" disabled className="text-dark-6">
            Sélectionner votre Produit
          </option>
          {Array.isArray(products) &&
            products.map((product) => (
              <option key={product.id} value={product.id} className="text-dark-6">
                {product.name}
              </option>
            ))}
        </select>

        <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.99922 12.8249C8.83047 12.8249 8.68984 12.7687 8.54922 12.6562L2.08047 6.2999C1.82734 6.04678 1.82734 5.65303 2.08047 5.3999C2.33359 5.14678 2.72734 5.14678 2.98047 5.3999L8.99922 11.278L15.018 5.34365C15.2711 5.09053 15.6648 5.09053 15.918 5.34365C16.1711 5.59678 16.1711 5.99053 15.918 6.24365L9.44922 12.5999C9.30859 12.7405 9.16797 12.8249 8.99922 12.8249Z"
              fill=""
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default SelectProduct;
