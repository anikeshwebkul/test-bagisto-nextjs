import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense } from "react";

import LogoIcon from "../icons/logo";

import FooterMenu from "./footer-menu";
import { ServiceContentSkeleton } from "./search/filter/filter-skeleton";
import Subscribe from "./subscribe";

import { isObject } from "@/lib/type-guards";
import { getThemeCustomization } from "@/lib/bagisto";
const ServiceContent = dynamic(
  () => import("@/components/theme-customization/section/service-content"),
  {
    ssr: true,
    loading: () => <ServiceContentSkeleton />,
  }
);
const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : "");
  const skeleton =
    "w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700";
  const menu = await getThemeCustomization();
  const copyrightName = COMPANY_NAME || SITE_NAME || "";
  const services = menu?.services_content?.[0];

  return (
    <>
      <div className="mx-auto my-12 w-full sm:my-30 md:my-20 md:max-w-4xl">
        {isObject(services) && (
          <ServiceContent
            name={services?.name}
            serviceData={services?.translations}
          />
        )}
      </div>
      <footer className="border-t border-neutral-200 text-sm text-neutral-500 dark:border-neutral-500 dark:text-neutral-400">
        <div className="mx-auto flex w-full max-w-screen-2xl flex-col justify-between gap-6 gap-y-6 px-6 py-12 pb-4 text-sm dark:border-neutral-700 md:flex-row md:gap-12 md:gap-y-20 md:px-4 min-[1320px]:px-0">
          <div className="">
            <Link className="flex items-center gap-2 md:pt-1" href="/">
              <LogoIcon />
            </Link>
          </div>
          <div className="flex flex-col gap-x-12 md:flex-row">
            <Suspense
              fallback={
                <div className="flex h-[188px] w-[200px] flex-col gap-2">
                  {Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className={skeleton} />
                    ))}
                </div>
              }
            >
              <FooterMenu menu={menu?.footer_links} />
            </Suspense>
            <Subscribe />
          </div>
        </div>
        <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
          <div className="mx-auto flex w-full max-w-screen-2xl flex-col justify-center gap-1 px-4 md:flex-row">
            <p className="text-center">
              &copy; {copyrightDate} {copyrightName}
              {copyrightName.length && !copyrightName.endsWith(".")
                ? "."
                : ""}{" "}
              All rights reserved.
            </p>
            <hr className="mx-4 hidden h-4 w-[1px] border-l border-neutral-400 md:inline-block" />
            <p className="text-center">Designed in Bagisto</p>
          </div>
        </div>
      </footer>
    </>
  );
}
