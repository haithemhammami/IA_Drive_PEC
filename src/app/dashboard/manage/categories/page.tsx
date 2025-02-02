import React from "react";
import FormCategories from "@/components/FormElements/categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "IA Drive PEC",
  description: " Application Drive alimentaire enrichie par IA pour Admin ",
};

const FormElementsPage = () => {
  return (
    <DefaultLayout>
      <FormCategories/>
    </DefaultLayout>
  );
};

export default FormElementsPage;