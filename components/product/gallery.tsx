"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { createUrl } from "@/lib/utils";
import { GridTileImage } from "@/components/grid/tile";

export function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const imageSearchParam = searchParams.get("image");
  const imageIndex = imageSearchParam ? parseInt(imageSearchParam) : 0;

  const nextSearchParams = new URLSearchParams(searchParams.toString());
  const nextImageIndex = imageIndex + 1 < images?.length ? imageIndex + 1 : 0;

  nextSearchParams.set("image", nextImageIndex.toString());
  const nextUrl = createUrl(pathname, nextSearchParams);

  const previousSearchParams = new URLSearchParams(searchParams.toString());
  const previousImageIndex =
    imageIndex === 0 ? images?.length - 1 : imageIndex - 1;

  previousSearchParams.set("image", previousImageIndex.toString());
  const previousUrl = createUrl(pathname, previousSearchParams);

  const buttonClassName =
    "flex h-full items-center justify-center px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white";

  return (
    <>
      <div className="group relative aspect-[1.2] h-full max-h-[738px] w-full max-w-[885px] overflow-hidden rounded-2xl">
        {images?.[imageIndex] && (
          <Image
            fill
            alt={images[imageIndex]?.altText as string}
            className={`${images?.[imageIndex] ? "fade-in" : ""} fade-in h-full w-full object-fill transition duration-300 ease-in-out group-hover:scale-105`}
            priority={true}
            sizes="(min-width: 1024px) 66vw, 100vw"
            src={images[imageIndex]?.src as string}
          />
        )}

        {images?.length > 1 ? (
          <div className="absolute bottom-[15%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur dark:border-black dark:bg-neutral-900/80">
              <Link
                aria-label="Previous product image"
                className={buttonClassName}
                href={previousUrl}
                scroll={false}
              >
                <ArrowLeftIcon className="h-5" />
              </Link>
              <div className="mx-1 h-6 w-px bg-neutral-500" />
              <Link
                aria-label="Next product image"
                className={buttonClassName}
                href={nextUrl}
                scroll={false}
              >
                <ArrowRightIcon className="h-5" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      {images?.length > 1 ? (
        <ul className="fade-in my-7 flex min-h-fit items-center justify-center gap-2 overflow-x-auto overflow-y-hidden py-1 lg:mb-0">
          {images.map((image, index) => {
            const isActive = index === imageIndex;
            const imageSearchParams = new URLSearchParams(
              searchParams.toString()
            );

            imageSearchParams.set("image", index.toString());

            return (
              <li key={image.src} className="min-w-32 relative aspect-square">
                <Link
                  aria-label="Enlarge product image"
                  className="h-full w-full"
                  href={createUrl(pathname, imageSearchParams)}
                  scroll={false}
                >
                  <GridTileImage
                    active={isActive}
                    alt={image.altText}
                    fill
                    objectFit="cover"
                    src={image.src}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </>
  );
}
