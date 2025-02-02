import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Suppliers from "@/components/lists/suppliers";


import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "IA Drive PEC",
  description: " Application Drive alimentaire enrichie par IA pour Admin ",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Liste fournisseurs" />

      <div className="flex flex-col gap-10">
        <Suppliers />

      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
