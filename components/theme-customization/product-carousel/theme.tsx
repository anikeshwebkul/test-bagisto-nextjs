"use client";
import { FC } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import { BagistoProductInfo } from "@/lib/bagisto/types";
import { NOT_IMAGE, variants } from "@/lib/constants";

const Theme: FC<{
  products: BagistoProductInfo[];
  name: string;
}> = ({ products, name }) => {
  return (
    <section>
      <div className="md:max-w-4.5xl mx-auto mb-6 w-full px-0 text-center xss:mb-10 md:px-36">
        <h2 className="mb-2 text-[28px] font-semibold text-black dark:text-white xss:mb-4 xss:text-4xl">
          {name}
        </h2>
        <p className="text-base font-normal text-black/60 dark:text-neutral-300 xss:text-lg">
          Discover the latest trends! Fresh products just added—shop new styles,
          tech, and essentials before they&apos;re gone.
        </p>
      </div>

      <div className="w-full pb-6 pt-1">
        <ul className="m-0 grid grid-cols-1 justify-center gap-6 p-0 xss:grid-cols-2 md:grid-cols-3 md:gap-[46px] lg:grid-cols-4">
          {products.map((product, index) => {
            const imageUrl =
              product?.cacheGalleryImages?.[0]?.originalImageUrl ??
              product?.images?.[0]?.url ??
              NOT_IMAGE;
            const price =
              product?.priceHtml?.finalPrice ||
              product?.priceHtml?.regularPrice ||
              "0";
            const currency = product?.priceHtml?.currencyCode;

            return (
              <motion.div
                initial="hidden"
                key={index}
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                variants={variants}
              >
                <ProductCard
                  currency={currency}
                  imageUrl={imageUrl}
                  price={price}
                  product={product}
                />
              </motion.div>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Theme;
