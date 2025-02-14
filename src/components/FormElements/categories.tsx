"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SelectCategories from "@/components/FormElements/SelectGroup/SelectCategorie";
import DeletCategorie from "@/components/Popups/DeletCategorie";
import ModifyCategorie from "@/components/Popups/ModifyCategorie";

// Define TypeScript interfaces for our data structures and components
interface Category {
  id: number;
  nom: string;
  logo?: string;
}

const FormElements = () => {
  // State for managing categories and form data
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "error" | "success"; message: string } | null>(null);

  // State for managing popups
  const [isModifyPopupOpen, setModifyPopupOpen] = useState(false);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);

  // State for form inputs
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryLogo, setNewCategoryLogo] = useState<File | null>(null);
  const [modifiedCategoryName, setModifiedCategoryName] = useState("");
  const [modifiedCategoryLogo, setModifiedCategoryLogo] = useState<File | null>(null);

  // Function to fetch all categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/categoriesAdmin");
      if (!response.ok) throw new Error("Erreur lors de la récupération des catégories");
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setErrorMessage("Impossible de charger les catégories");
      console.error("Error fetching categories:", err);
    }
  }, []);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Function to handle category selection
  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    setModifiedCategoryName(category.nom);
  };

  // Function to set error message
  const setErrorMessage = (message: string) => {
    setStatusMessage({ type: "error", message });
    setTimeout(() => setStatusMessage(null), 10000); // Clear message after 10 seconds
  };

  // Function to set success message
  const setSuccessMessage = (message: string) => {
    setStatusMessage({ type: "success", message });
    setTimeout(() => setStatusMessage(null), 10000); // Clear message after 10 seconds
  };

  // Function to add a new category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    try {
      if (!newCategoryName.trim()) {
        throw new Error("Le nom de la catégorie est requis");
      }

      const formData = new FormData();
      formData.append("nom", newCategoryName);
      if (newCategoryLogo) {
        formData.append("logo", newCategoryLogo);
      }

      const response = await fetch("/api/categoriesAdmin", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de l'ajout de la catégorie");
      }

      setSuccessMessage("Catégorie ajoutée avec succès !");
      setNewCategoryName("");
      setNewCategoryLogo(null);
      await fetchCategories();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to modify a category
  const handleModifyCategory = async () => {
    if (!selectedCategory) {
      setErrorMessage("Veuillez sélectionner une catégorie");
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const formData = new FormData();
      formData.append("nom", modifiedCategoryName || selectedCategory.nom);
      if (modifiedCategoryLogo) {
        formData.append("logo", modifiedCategoryLogo);
      }

      const response = await fetch(`/api/categoriesAdmin/${selectedCategory.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la modification");
      }

      setSuccessMessage("Catégorie modifiée avec succès !");
      setModifyPopupOpen(false);
      await fetchCategories();

      // Reset form
      setModifiedCategoryName("");
      setModifiedCategoryLogo(null);
      setSelectedCategory(null);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to delete a category
  const handleDeleteCategory = async () => {
    if (!selectedCategory) {
      setErrorMessage("Veuillez sélectionner une catégorie");
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch(`/api/categoriesAdmin/${selectedCategory.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la suppression");
      }

      setSuccessMessage("Catégorie supprimée avec succès !");
      setDeletePopupOpen(false);
      await fetchCategories();
      setSelectedCategory(null);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Gérer les rayons" />

      {statusMessage && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            statusMessage.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {statusMessage.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* Add Category Form */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">Ajouter un Rayon</h3>
            </div>

            <form onSubmit={handleAddCategory}>
              <div className="flex flex-col gap-5.5 p-6.5">
                <div>
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Nom du Rayon</label>
                  <input
                    type="text"
                    placeholder="Nom du Rayon"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Logo du Rayon</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewCategoryLogo(e.target.files ? e.target.files[0] : null)}
                    className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>

          {/* Modify Category Form */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">Modifier un Rayon</h3>
            </div>

            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <SelectCategories 
                  categories={categories} 
                  selectedCategory={selectedCategory} 
                  onCategoryChange={handleCategoryChange} 
                />
              </div>

              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Nouveau Nom du Rayon
                </label>
                <input
                  type="text"
                  placeholder="Nouveau nom du rayon"
                  value={modifiedCategoryName}
                  onChange={(e) => setModifiedCategoryName(e.target.value)}
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  disabled={isLoading || !selectedCategory}
                />
              </div>

              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Nouveau Logo du Rayon
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setModifiedCategoryLogo(e.target.files ? e.target.files[0] : null)}
                  className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
                  disabled={isLoading || !selectedCategory}
                />
              </div>

              <button
                type="button"
                onClick={() => setModifyPopupOpen(true)}
                className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50"
                disabled={isLoading || !selectedCategory}
              >
                Modifier
              </button>
            </div>
          </div>

          {/* Delete Category Section */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">Supprimer un Rayon</h3>
            </div>

            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <SelectCategories 
                  categories={categories} 
                  selectedCategory={selectedCategory} 
                  onCategoryChange={handleCategoryChange} 
                />
              </div>

              <button
                type="button"
                onClick={() => setDeletePopupOpen(true)}
                className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50"
                disabled={isLoading || !selectedCategory}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Popups */}
      {isModifyPopupOpen && (
        <ModifyCategorie
          onClose={() => setModifyPopupOpen(false)}
          onConfirm={handleModifyCategory}
          isLoading={isLoading}
        />
      )}

      {isDeletePopupOpen && (
        <DeletCategorie
          onClose={() => setDeletePopupOpen(false)}
          onConfirm={handleDeleteCategory}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default FormElements;