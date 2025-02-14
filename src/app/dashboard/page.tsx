'use client'; // Directive pour indiquer que le fichier est un composant client

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ECommerce from "@/components/Dashboard/E-commerce";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import useAuth from "@/hooks/useAuth";

export default function Home() {
  const { loading, isAdmin } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const path = window.location.pathname; // Récupère l'URL actuelle

    // Si l'utilisateur est en cours de chargement, on ne fait rien
    if (loading) return;

    console.log("Path:", path);
    console.log("Loading:", loading);
    console.log("isAdmin:", isAdmin);

    // Si l'utilisateur tente d'accéder au dashboard
    if (path.startsWith("/dashboard")) {
      // Si l'utilisateur n'est pas authentifié ou n'est pas admin, on le redirige
      if (!isAdmin) {
        console.log("User is not admin, redirecting to home");
        router.push("/");
      } else {
        setAuthorized(true);
        console.log("User is admin, access granted");
      }
    } else {
      setAuthorized(true);
    }
  }, [loading, isAdmin, router]);

  if (loading || !authorized) {
    return <p>Chargement...</p>; // Empêche l'affichage du contenu du dashboard
  }

  return (
    <DefaultLayout>
      <ECommerce />
    </DefaultLayout>
  );
}
