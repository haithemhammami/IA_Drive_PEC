"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import OrderTable from "@/components/lists/OrderTable";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

const OrdersPage = () => {
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
      <Breadcrumb pageName="Liste des Commandes" />
      <div className="flex flex-col gap-10">
        <OrderTable />
      </div>
    </DefaultLayout>
  );
};

export default OrdersPage;

