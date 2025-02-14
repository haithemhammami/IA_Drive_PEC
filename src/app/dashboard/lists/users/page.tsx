"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Users from "@/components/lists/users";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import useAuth from "@/hooks/useAuth";

const TablesPage = () => {
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
      <Breadcrumb pageName="Liste utilisateurs" />
      <div className="flex flex-col gap-10">
        <Users />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
