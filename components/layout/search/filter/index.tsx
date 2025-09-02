"use client";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  getFilterAttributeTypes,
  SortFilterItemTypes,
} from "@/lib/bagisto/types";
import { SORT } from "@/lib/constants";
import { isArray } from "@/lib/type-guards";
import { createUrl } from "@/lib/utils";

export type ListItem = SortFilterItemTypes | PathFilterItem;
export type PathFilterItem = { title: string; path: string };

import React, { useState, useMemo, useTransition } from "react";

function FilterItemList({
  list,
  title,
}: {
  list: getFilterAttributeTypes;
  title: string;
}) {
  const currentParams = useSearchParams();
  const sort = currentParams.get(SORT) || "name-asc";
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Optimistic UI: state updates instantly
  const initialSelected = useMemo(
    () => new Set(currentParams.get(list.code)?.split(",") ?? []),
    [list.code, currentParams]
  );
  const [selectedFilters, setSelectedFilters] =
    useState<Set<string>>(initialSelected);

  // Memoize options for big lists
  const memoizedOptions = useMemo(() => list.options, [list.options]);

  const handleFilterChange = (selectedIds: Set<string>) => {
    setSelectedFilters(selectedIds); // Optimistic update
    const code = list.code;
    const selected = Array.from(selectedIds);
    const newParams = new URLSearchParams(currentParams.toString());
    if (selected.length > 0) {
      newParams.set(code, selected.join(","));
    } else {
      newParams.delete(code);
    }
    if (sort) newParams.set(SORT, sort);
    const newUrl = createUrl(pathname, newParams);
    // Shallow routing, backgrounded with startTransition
    startTransition(() => {
      router.replace(newUrl, { scroll: false });
    });
  };

  return (
    <div className="min-w-48 w-full">
      <Select
        isMultiline
        items={memoizedOptions}
        radius="md"
        size="md"
        labelPlacement="inside"
        placeholder={`Select a ${title}`}
        renderValue={(items) => (
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-1">
            {items.map((item) => (
              <Chip key={item.key}>{item.data?.adminName}</Chip>
            ))}
          </div>
        )}
        selectedKeys={selectedFilters}
        selectionMode="multiple"
        variant="flat"
        onSelectionChange={(keys) => handleFilterChange(keys as Set<string>)}
        isLoading={isPending}
      >
        {(item) => (
          <SelectItem key={item.id} textValue={item.id}>
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-small">{item.adminName}</span>
              </div>
            </div>
          </SelectItem>
        )}
      </Select>
    </div>
  );
}

export default function FilterList({
  filterAttributes,
}: {
  filterAttributes: any;
}) {
  return filterAttributes?.map((item: getFilterAttributeTypes) => {
    const hasOptions = isArray(item.options);

    return hasOptions ? (
      <FilterItemList key={item.id} list={item} title={item?.adminName} />
    ) : null;
  });
}
