"use client";
import { FC } from "react";

import { AddressDataTypes, CountryArrayDataType } from "@/lib/bagisto/types";
import { getCheckoutAddress } from "@/lib/bagisto";
import { useQuery } from "@tanstack/react-query";
import { getCustomerAddressQuery } from "@/lib/bagisto/queries/checkout";
import { fetchHandler } from "@/lib/fetch-handler";
import { isArray, isObject } from "@/lib/type-guards";
import CustomerAddress from "./customer-address";
import AddressSkeleton from "@/components/skeleton/address-skeleton";
import AddAdressForm from "./add-address-form";

interface ShippingAddressCheckOutProps {
  isGuest?: boolean;
  countries: CountryArrayDataType[];
  billingAddress?: AddressDataTypes;
  shippingAddress?: AddressDataTypes;
}
const ShippingAddress: FC<ShippingAddressCheckOutProps> = ({
  countries,
  billingAddress,
  shippingAddress,
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["shipping-methods"],
    refetchOnWindowFocus: false,
    queryFn: async () =>
      fetchHandler({
        url: "/checkout/address",
        method: "GET",
      }),
  });

  const customerAddress = data?.checkoutAddresses;

  return isLoading ? (
    <AddressSkeleton />
  ) : isArray(customerAddress?.addresses) && isObject(customerAddress) ? (
    <CustomerAddress
      addresses={customerAddress as any}
      billingAddress={billingAddress}
      shippingAddress={shippingAddress}
      countries={countries}
    />
  ) : (
    <AddAdressForm countries={countries} />
  );
};

export default ShippingAddress;
