import { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import Grid from "@/components/grid";
import FilterListSkeleton, {
  SortOrderSkeleton,
} from "@/components/layout/search/filter/filter-skeleton";
import NotFound from "@/components/layout/search/not-found";
import Prose from "@/components/prose";
import {
  getCollection,
  getFilterAttributes,
  getMenu,
  getProducts,
} from "@/lib/bagisto";
import { isObject } from "@/lib/type-guards";
import MobileFilter from "@/components/layout/search/filter/modile-filter";
const ProductGridItems = dynamic(
  () => import("@/components/layout/product-grid-items"),
  {
    ssr: true,
  }
);
const FilterList = dynamic(() => import("@/components/layout/search/filter"), {
  ssr: true,
});
const SortOrder = dynamic(
  () => import("@/components/layout/search/filter/sort-order"),
  {
    ssr: true,
  }
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection: categorySlug } = await params;
  const collections = await getMenu("catalog");
  const categoryItem = collections.find(
    (item) => item.path == `/search/${categorySlug}`
  );
  const categoryId = categoryItem?.id;
  const collection = await getCollection(categoryId || "");

  if (!collection) return notFound();

  const firstP = collection[0];

  return {
    title: firstP?.metaTitle || firstP?.name,
    description:
      firstP?.metaDescription ||
      firstP?.description ||
      `${firstP?.name} products`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { collection: categorySlug } = await params;
  const collections = await getMenu("catalog");

  const categoryItem = collections.find(
    (item) => item.path == `/search/${categorySlug}`
  );
  const categoryId = categoryItem?.id || "";

  const { sort: sortKey = "name-desc", ...rest } = (await searchParams) as {
    [key: string]: string;
  };
  const filters = Object.entries(rest).map(([key, value]) => ({
    key,
    value,
  }));

  const products = await getProducts({
    categoryId,
    sortKey,
    filters,
    tag: categorySlug,
  });

  const productAttributes = await getFilterAttributes({
    categorySlug: categorySlug,
  });
  const sortOrders = productAttributes?.sortOrders;
  const filterAttributes = productAttributes?.filterAttributes;

  return (
    <section>
      {isObject(categoryItem) && categoryItem?.description && (
        <Prose
          className="mx-auto mt-7.5 w-full max-w-screen-2xl"
          html={categoryItem?.description}
        />
      )}
      <div className="my-10 hidden flex-1 grid-cols-[repeat(auto-fit,minmax(180px,1fr))] items-center gap-4 md:grid xl:grid-cols-[repeat(auto-fit,minmax(180px,192px))]">
        <Suspense fallback={<FilterListSkeleton />}>
          <FilterList filterAttributes={filterAttributes} />
        </Suspense>

        <Suspense fallback={<SortOrderSkeleton />}>
          <SortOrder sortOrders={sortOrders} title="Sort by" />
        </Suspense>
      </div>
      <div className="flex items-center justify-between gap-4 py-8 md:hidden">
        <MobileFilter filterAttributes={filterAttributes} />

        <Suspense fallback={<SortOrderSkeleton />}>
          <SortOrder sortOrders={sortOrders} title="Sort by" />
        </Suspense>
      </div>
      {products.length === 0 ? (
        <NotFound
          msg={`There are no products that match Showing : ${categorySlug}`}
        />
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <ProductGridItems products={products} />
        </Grid>
      )}
    </section>
  );
}
