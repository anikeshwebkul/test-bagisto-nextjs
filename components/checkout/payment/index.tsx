"use client";

import { useQuery } from "@tanstack/react-query";
import { FC } from "react";

import PaymentMethod from "./payment-method";

import { fetchHandler } from "@/lib/fetch-handler";
import { CartCheckoutPageSkeleton } from "@/components/checkout/place-holder";
import { selectedPaymentMethodType } from "@/lib/bagisto/types";

const Payment: FC<{
  selectedPayment?: selectedPaymentMethodType;
  selectedShippingRate: string;
}> = ({ selectedPayment, selectedShippingRate }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["Payment-methods"],
    refetchOnWindowFocus: false,
    queryFn: async () =>
      fetchHandler({
        url: "/checkout/paymentMethods",
        method: "POST",
        contentType: true,
        body: {
          input: {
            shippingMethod: selectedShippingRate,
          },
        },
      }),
  });
  const methods = data?.paymentMethods;

  return isLoading ? (
    <CartCheckoutPageSkeleton />
  ) : (
    <PaymentMethod
      methods={methods?.paymentMethods}
      selectedPayment={selectedPayment}
    />
  );
};

export default Payment;
