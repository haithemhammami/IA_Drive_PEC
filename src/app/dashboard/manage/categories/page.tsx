"use client";
import React, { useEffect, useState } from "react";
import FormCategories from "@/components/FormElements/categories";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useRouter } from "next/navigation";

import useAuth from "@/hooks/useAuth";

const FormElementsPage = () => {
  const { loading, isAdmin } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!isAdmin) {
      router.push("/");
    } else {
      setAuthorized(true);
    }
  }, [loading, isAdmin, router]);

  if (loading || !authorized) {
    return <p>Chargement...</p>;
  }

  return (
    <DefaultLayout>
      <FormCategories/>
    </DefaultLayout>
  );
};

export default FormElementsPage;