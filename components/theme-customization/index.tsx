import { FC } from "react";

import MainBanner from "./section/main-banner";

import { ThemeCustomizationTypes } from "@/lib/bagisto/types";
import ThreeItemGrid from "../grid/three-items";
import ProductCarousel from "./product-carousel";
import CategoryCarousel from "./category-carousel";

const ThemeCustomization: FC<{
  themeCustomization: Array<ThemeCustomizationTypes>;
}> = async ({ themeCustomization = [] }) => {
  // Sort content sections by sortOrder
  const sortedSections = [...themeCustomization].sort(
    (a, b) => Number(a.sortOrder) - Number(b.sortOrder)
  );
  // Render each section type
  const renderSection = (
    section: (typeof themeCustomization)[number],
    index: number
  ) => {
    const { name, sortOrder, type, translations } = section;
    const key = `${type}-${sortOrder}-${index}`;

    switch (type) {
      case "image_carousel":
        return <MainBanner key={key} data={translations} />;
      // case "product_carousel":
      //   if (parseInt(sortOrder) === 4) {
      //     return <ThreeItemGrid key={key} data={translations} name={name} />;
      //   } else {
      //     return (
      //       <ProductCarousel
      //         key={key}
      //         data={translations}
      //         name={name}
      //         sortOrder={sortOrder}
      //       />
      //     );
      //   }
      // case "category_carousel":
      //   return (
      //     <CategoryCarousel key={key} categoryData={translations} name={name} />
      //   );

      default:
        return null;
    }
  };

  return (
    <section className="flex flex-col gap-y-10 pb-4 md:gap-y-20">
      {sortedSections.map(renderSection)}
    </section>
  );
};

export default ThemeCustomization;
