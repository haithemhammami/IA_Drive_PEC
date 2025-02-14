"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface User {
  id: number;
  nom: string;
  email: string;
  phone: string | null;
  adresse: string | null;
  isActive: boolean;
  dateCreation: string;
  role: string;
  derniereCommandeId: number | null;
}

const TableOne = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/usersAdmin?page=${page}&limit=${limit}&search=${search}`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.users);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchUsers();
  }, [page, search, fetchUsers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < Math.ceil(total / limit)) {
      setPage(page + 1);
    }
  };

  return (
    <div className="rounded-[10px] bg-white px-4 pb-4 pt-6 shadow-1 dark:bg-gray-dark dark:shadow-card sm:px-7.5 sm:pt-7.5">
      <h4 className="mb-4 text-xl font-bold text-dark dark:text-white sm:text-2xl">Tous les utilisateurs</h4>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          value={search}
          onChange={handleSearchChange}
          className="w-full rounded-md border border-gray-300 bg-white px-5 py-3 outline-none focus:border-primary hover:border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-colors duration-200"
        />
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left bg-gray-200 dark:bg-gray-900 transition-colors duration-200">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Nom/Prénom</th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Numéro</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Email</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Adresse</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Rôle</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Dernière commande</th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Statut</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  Chargement...
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user.id}
                  className={`${index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"} hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200`}
                >
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-gray-900 dark:text-gray-100">{user.nom}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">ID: {user.id}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{user.phone || "N/A"}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{user.email}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{user.adresse || "N/A"}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{user.role}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {user.derniereCommandeId ? `#${user.derniereCommandeId}` : "Aucune"}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium transition-all duration-200 ${
                        user.isActive
                          ? "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900"
                          : "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900"
                      }`}
                    >
                      {user.isActive ? "Actif" : "Inactif"}
                    </p>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Affichage de {(page - 1) * limit + 1} à {Math.min(page * limit, total)} sur {total} utilisateurs
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="ml-1">Précédent</span>
          </button>
          <button
            onClick={handleNextPage}
            disabled={page >= Math.ceil(total / limit)}
            className="flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <span className="mr-1">Suivant</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableOne;