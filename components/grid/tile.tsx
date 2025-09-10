"use client";

import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

import Label from "../label";
import { NOT_IMAGE } from "@/lib/constants";

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  src,
  alt,
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
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!imgSrc && !error) {
      setImgSrc(src as string);
    }
  }, [imgSrc, src, error]);

  const loadDone = () => {
    setTimeout(() => {
      if (!src) {
        setImgSrc(NOT_IMAGE);
      }
    }, 500);
    setLoading(false);
  };

  useEffect(() => {
    error && setImgSrc(NOT_IMAGE);
  }, [error]);

  return (
    <div
      className={clsx(
        "group relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg dark:bg-black",
        active ? "border-2 border-blue-600 " : " border-2 border-transparent",
        {
          relative: label,
        }
      )}
    >
      {imgSrc ? (
        <Image
          src={imgSrc}
          alt={alt ?? ""}
          placeholder="blur"
          blurDataURL={NOT_IMAGE}
          onError={() => setError(true)}
          onLoadingComplete={() => loadDone()}
          className={clsx(
            props.className,
            "duration-700 truncate h-full transition group-hover:scale-105 w-full object-contain ease-in-out align-[none]",
            error ? "!bg-contain" : "",
            isLoading
              ? "grayscale blur-2xl rounded-md truncate"
              : "grayscale-0 blur-0"
          )}
          {...props}
        />
      ) : (
        <div className="h-full w-full animate-pulse bg-gray-100" />
      )}

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
