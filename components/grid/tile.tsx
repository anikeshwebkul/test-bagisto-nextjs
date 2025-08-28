"use client";
import clsx from "clsx";
import Image from "next/image";

import Label from "../label";

import { NOT_IMAGE } from "@/lib/constants";

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    page?: string;
    amount: string;
    currencyCode: string;
    position?: "bottom" | "center" | "left";
  };
} & React.ComponentProps<typeof Image>) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = NOT_IMAGE; // Fallback image on error
  };

  return (
    <div
      className={clsx(
        "group relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg dark:bg-black",
        {
          relative: label,
          "border-2 border-blue-600": active,
          "border-neutral-200 dark:border-neutral-800": !active,
        }
      )}
    >
      {}
      <Image
        className={clsx(props.className, "h-full w-full object-contain", {
          "transition duration-300 ease-in-out group-hover:scale-105":
            isInteractive,
        })}
        // onError={handleError}
        {...props}
      />

      {label ? (
        <Label
          amount={label.amount}
          currencyCode={label.currencyCode}
          page={label.page}
          position={label.position}
          title={label.title}
        />
      ) : null}
    </div>
  );
}
