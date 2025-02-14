"use client"; // Assurez-vous que ce fichier est un composant client

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useAuth() {
  const [user, setUser] = useState<any>(null);  // L'état de l'utilisateur
  const [loading, setLoading] = useState(true); // L'état de chargement
  const [isVerified, setIsVerified] = useState(false); // Vérifie si l'email est validé
  const [isAdmin, setIsAdmin] = useState(false); // Vérifie si l'utilisateur est admin
  const [isClient, setIsClient] = useState(false); // État pour vérifier si le composant est monté côté client
  const router = useRouter();

  // Assurer que le code s'exécute uniquement côté client
  useEffect(() => {
    setIsClient(true); // Assurez-vous que le code fonctionne après que le composant soit monté
  }, []);

  useEffect(() => {
    if (!isClient) return; // Ne pas exécuter la logique tant que ce n'est pas côté client

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token"); // Récupérer le token depuis le localStorage
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const res = await fetch("/api/auth/check-session", {
          headers: {
            Authorization: `Bearer ${token}` // Ajouter le token dans l'en-tête de la requête
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setIsVerified(data.user.emailVerified);  // Si l'email est vérifié
          setIsAdmin(data.user.role === "ADMIN"); // Vérifie si le rôle est admin
          console.log("User:", data.user);
          console.log("isVerified:", data.user.emailVerified);
          console.log("isAdmin:", data.user.role === "ADMIN");
        } else {
          setUser(null);
          console.log("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la session:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [isClient]); // N'exécute cette logique que lorsque le composant est monté côté client

  useEffect(() => {
    if (!loading && user && !isVerified) {
      router.push("/auth/verify-email");  // Redirige vers une page de vérification si non vérifié
    }
  }, [loading, user, isVerified, router]);

  return { user, isVerified, isAdmin, loading };
}
