import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Users from "@/components/lists/users";


import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "IA Drive PEC",
  description: " Application Drive alimentaire enrichie par IA pour Admin ",
};

const TablesPage = () => {
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
