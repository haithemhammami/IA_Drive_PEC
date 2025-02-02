import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import AlertError from "@/components/Alerts/AlertError";
import AlertWarning from "@/components/Alerts/AlertWarning";
import AlertSuccess from "@/components/Alerts/AlertSuccess";

export const metadata: Metadata = {
  title: "IA Drive PEC",
  description: " Application Drive alimentaire enrichie par IA pour Admin ",
  // other metadata
};

const Alerts = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Alerts Produits" />

      <div className="rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark dark:shadow-card md:p-6 xl:p-9">
        <div className="flex flex-col gap-7.5">
          <AlertWarning />
          <AlertSuccess />
          <AlertError />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Alerts;
