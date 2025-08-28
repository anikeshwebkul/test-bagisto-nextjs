import { ProductCard } from "@/components/product-card";
import { Product } from "@/lib/bagisto/types";
import { NOT_IMAGE } from "@/lib/constants";

export default function ProductGridItems({
  products,
}: {
  products: Product[];
}) {
  return products.map((product, index) => {
    const imageUrl =
      product?.cacheGalleryImages?.[0]?.originalImageUrl ??
      product?.images?.[0]?.url ??
      NOT_IMAGE;
    const price =
      product?.priceHtml?.finalPrice || product?.priceHtml?.regularPrice || "0";
    const currency = product?.priceHtml?.currencyCode;

    return (
      <ProductCard
        key={index}
        currency={currency}
        imageUrl={imageUrl}
        price={price}
        product={product}
      />
    );
  });
}
