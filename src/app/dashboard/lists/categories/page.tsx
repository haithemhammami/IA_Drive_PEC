import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/lists/categories";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "IA Drive PEC",
  description: " Application Drive alimentaire enrichie par IA pour Admin ",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Liste rayons" />

      <div className="flex flex-col gap-10">
        <TableOne />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
