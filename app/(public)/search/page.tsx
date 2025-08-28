import dynamic from "next/dynamic";
import { Suspense } from "react";
import Grid from "@/components/grid";
import FilterListSkeleton, {
  SortOrderSkeleton,
} from "@/components/layout/search/filter/filter-skeleton";
import NotFound from "@/components/layout/search/not-found";
import { getFilterAttributes, getProducts } from "@/lib/bagisto";
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

export const metadata = {
  title: "Search",
  description: "Search for products in the store.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const {
    sort: sortKey = "name-desc",
    q: searchValue,
    ...rest
  } = (await searchParams) as { [key: string]: string };

  const filters = Object.entries(rest).map(([key, value]) => ({
    key,
    value,
  }));

  const products = await getProducts({
    sortKey,
    query: searchValue,
    filters,
    tag: "search",
  });

  const productAttributes = await getFilterAttributes({ categorySlug: "" });
  const sortOrders = productAttributes?.sortOrders;
  const filterAttributes = productAttributes?.filterAttributes;

  return (
    <>
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

      {products.length === 0 && (
        <NotFound
          msg={`${
            searchValue
              ? `There are no products that match Showing : ${searchValue}`
              : "There are no products that match Showing"
          } `}
        />
      )}
      {products.length > 0 ? (
        <Grid className="mb-4 grid-cols-1 400:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
