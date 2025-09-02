import dynamic from "next/dynamic";
import { FC } from "react";
import MainBanner from "./section/main-banner";
import { ThemeCustomizationTypes } from "@/lib/bagisto/types";
import { ThemeSkeleton } from "./product-carousel/crausel-skeleton";
import { ThreeItemGridSkeleton } from "@/components/grid/three-items-skeleton";

// Only lazy-load below-the-fold carousels
const ProductCarousel = dynamic(() => import("./product-carousel"), {
  ssr: true,
  loading: () => <ThemeSkeleton />,
});
const CategoryCarousel = dynamic(() => import("./category-carousel"), {
  ssr: true,
  loading: () => <ThemeSkeleton />,
});
const ThreeItemGrid = dynamic(() => import("@/components/grid/three-items"), {
  ssr: true,
  loading: () => <ThreeItemGridSkeleton />,
});

const ThemeCustomization: FC<{
  themeCustomization: Array<ThemeCustomizationTypes>;
}> = async ({ themeCustomization = [] }) => {
  // Sort sections by sortOrder
  const sortedSections = [...themeCustomization].sort(
    (a, b) => Number(a.sortOrder) - Number(b.sortOrder)
  );

  return (
    <section className="flex flex-col gap-y-10 pb-4 md:gap-y-20">
      {sortedSections.map((section, index) => {
        const { name, sortOrder, type, translations } = section;
        const key = `${type}-${sortOrder}-${index}`;

        // Render hero section directly for fast LCP
        if (type === "image_carousel") {
          return <MainBanner key={key} data={translations} />;
        }

        // Lazy-load only below-the-fold carousels
        if (type === "product_carousel") {
          if (parseInt(sortOrder) === 4) {
            return <ThreeItemGrid key={key} data={translations} name={name} />;
          }
          return (
            <ProductCarousel
              key={key}
              data={translations}
              name={name}
              sortOrder={sortOrder}
            />
          );
        }

        if (type === "category_carousel") {
          return (
            <CategoryCarousel
              key={key}
              categoryData={translations}
              name={name}
            />
          );
        }

        return null;
      })}
    </section>
  );
};

export default ThemeCustomization;
