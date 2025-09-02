"use client";
import { Accordion, AccordionItem } from "@heroui/accordion";
import React, { FC } from "react";
import { Avatar } from "@heroui/avatar";

import Rating from ".";

import { GridTileImage } from "@/components/grid/tile";
import Prose from "@/components/prose";
import { isArray } from "@/lib/type-guards";
import { formatDate, getReviews } from "@/lib/utils";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";

export type additionalDataTypes = {
  id: string;
  code: string;
  label: string;
  value: null;
  admin_name: string;
  type: string;
};

export const ProductMoreDetails: FC<{
  description: string;
  additionalData: additionalDataTypes[];
  reviews: any[];
  totalReview: number;
}> = ({ description, additionalData, reviews, totalReview }) => {
  return (
    <div className="my-7">
      <Accordion
        itemClasses={{
          base: "shadow-none cursor-pointer bg-neutral-100 dark:bg-neutral-800",
        }}
        selectionMode="multiple"
        showDivider={false}
        variant="splitted"
      >
        <AccordionItem
          key="1"
          indicator={({ isOpen }) =>
            isOpen ? (
              <ChevronLeftIcon className="h-5 w-5 stroke-neutral-800 dark:stroke-white" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 stroke-neutral-800 dark:stroke-white" />
            )
          }
          aria-label="Description"
          title="Description"
        >
          <Prose html={description} />
        </AccordionItem>
        <AccordionItem
          key="2"
          indicator={({ isOpen }) =>
            isOpen ? (
              <ChevronLeftIcon className="h-5 w-5 stroke-neutral-800 dark:stroke-white" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 stroke-neutral-800 dark:stroke-white" />
            )
          }
          aria-label="Additional Information"
          title="Additional Information"
        >
          <div className="grid max-w-max grid-cols-[auto_1fr] gap-x-8 gap-y-4 px-1">
            {additionalData?.map((item) => (
              <React.Fragment key={item.label}>
                <div className="grid">
                  <p className="text-base font-normal text-black/60 dark:text-white">
                    {" "}
                    {item?.label}{" "}
                  </p>
                </div>
                <div className="grid">
                  <p className="text-base font-normal text-black/60 dark:text-white">
                    {" "}
                    {item?.value || "--"}{" "}
                  </p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </AccordionItem>
        <AccordionItem
          key="3"
          indicator={({ isOpen }) =>
            isOpen ? (
              <ChevronLeftIcon className="h-5 w-5 stroke-neutral-800 dark:stroke-white" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 stroke-neutral-800 dark:stroke-white" />
            )
          }
          aria-label="Ratings"
          title="Ratings"
        >
          <ReviewDetail reviewDetails={reviews} totalReview={totalReview} />
        </AccordionItem>
      </Accordion>
    </div>
  );
};
export interface ReviewDatatypes {
  id: string;
  name: string;
  title: string;
  rating: 5;
  status: string;
  comment: string;
  productId: string;
  customerId: string;
  createdAt: string;
  images: {
    url: string;
    reviewId: string;
  }[];
  customer: {
    name: string;
    imageUrl: string;
  };
}
export interface Props {
  reviewDetails: ReviewDatatypes[];
  totalReview: number;
}
const ReviewDetail: FC<Props> = ({ reviewDetails, totalReview }) => {
  const { reviewAvg, ratingCounts } = getReviews(reviewDetails);

  return (
    <div className="flex flex-wrap gap-x-5 sm:gap-x-10">
      {/* Rating Summary */}

      <div className="my-2 flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-x-2">
          <Rating length={5} size="size-5" star={reviewAvg} />
          <p className="font-outfit text-lg font-normal leading-none text-black dark:text-white">{`(${totalReview} Ratings)`}</p>
        </div>
        <div className="flex">
          {Object.entries(ratingCounts)
            .reverse()
            .map(([star, count]) => (
              <div key={star + count} className="">
                {star === "5" && (
                  <div
                    className="w min-h-4 min-w-24 cursor-pointer rounded-l-sm bg-green-700"
                    title={`${count} Ratings`}
                  />
                )}
                {star === "4" && (
                  <div
                    className="min-h-4 min-w-16 cursor-pointer bg-cyan-400"
                    title={`${count} Ratings`}
                  />
                )}
                {star === "3" && (
                  <div
                    className="min-h-4 min-w-12 cursor-pointer bg-violet-600"
                    title={`${count} Ratings`}
                  />
                )}
                {star === "2" && (
                  <div
                    className="min-h-4 min-w-12 cursor-pointer bg-yellow-400"
                    title={`${count} Ratings`}
                  />
                )}
                {star === "1" && (
                  <div
                    className="min-h-4 min-w-6 cursor-pointer rounded-r-sm bg-red-600"
                    title={`${count} Ratings`}
                  />
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="flex w-full flex-1 flex-col gap-5 py-6">
        {reviewDetails?.map(
          (
            { name, title, comment, createdAt, rating, images, customer },
            index
          ) => (
            <div key={index} className="flex flex-col gap-y-2">
              <h1 className="font-outfit text-xl font-medium text-black/[80%] dark:text-white">
                {title}
              </h1>
              <Rating className="my-1" length={5} size="size-5" star={rating} />
              <h2 className="font-outfit text-base font-normal text-black/[80%] dark:text-white">
                {comment}
              </h2>
              <div className="flex gap-4">
                <div className="flex w-full items-center gap-2">
                  <Avatar
                    className="min-w-20 h-20 text-large"
                    name={name}
                    src={customer?.imageUrl}
                  />
                  <div>
                    <h1 className="font-outfit text-base font-medium dark:text-black">
                      {name}
                    </h1>
                    <p className="text-sm text-zinc-500">
                      {formatDate(createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {isArray(images) && images.length > 0 && (
                <div className="mt-2 flex h-full min-h-[50px] w-full max-w-[60px] flex-wrap gap-2">
                  {images.map((img) => (
                    <GridTileImage
                      key={img.reviewId}
                      fill
                      alt={`${img.reviewId}-review`}
                      className="rounded-lg"
                      src={img.url}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};
