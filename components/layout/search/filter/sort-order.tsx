"use client";

import { Select, SelectItem } from "@heroui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC } from "react";
import { Chip } from "@heroui/chip";

import { createUrl } from "@/lib/utils";
import { SORT } from "@/lib/constants";

export type SortOrderTypes = {
  key: string;
  title: string;
  value: string;
  sort: string;
  order: string;
  position: string;
};

const SortOrder: FC<{
  sortOrders: SortOrderTypes[];
  title: string;
}> = ({ sortOrders, title }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const sort = searchParams.get(SORT) || "name-asc";

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (value) newParams.set(SORT, value);
    const newUrl = createUrl(pathname, newParams);

    router.replace(newUrl);
  };

  return (
    <section className="flex w-full max-w-[15.625rem] flex-1 items-center gap-x-2.5 dark:text-white min-[1300px]:ml-auto min-[1300px]:[grid-column-start:-1]">
      <p
        id="sort-label"
        className="leading-0 text-nowrap min-[1300]:block hidden"
      >
        {title}
      </p>
      <Select
        defaultOpen={false}
        aria-label={title}
        aria-labelledby="sort-label"
        defaultSelectedKeys={[sort]}
        isMultiline={false}
        items={sortOrders}
        placeholder="Select a Sort Order"
        renderValue={(items) => (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-1">
            {items.map((item) => (
              <Chip key={item.key}>{item.data?.title}</Chip>
            ))}
          </div>
        )}
        size="md"
        variant="flat"
        onSelectionChange={(e) => handleSortChange(e.currentKey as string)}
      >
        {(order) => (
          <SelectItem key={order.value} textValue={order.value}>
            {order.title}
          </SelectItem>
        )}
      </Select>
    </section>
  );
};

export default SortOrder;
