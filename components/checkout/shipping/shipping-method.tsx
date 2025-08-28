"use client";

import { FieldValues, useForm, Controller } from "react-hook-form";
import { cn, Radio, RadioGroup } from "@heroui/react";

import { ProceedToCheckout } from "../cart/proceed-to-checkout";

import { useCheckout } from "@/components/hooks/use-checkout";
import { isArray } from "@/lib/type-guards";
import { ShippingArrayDataType } from "@/lib/bagisto/types";
import { useCustomToast } from "@/components/hooks/use-toast";
import { useState } from "react";

type CustomRadioProps = {
  children: React.ReactNode;
  description?: string;
  value: string;
} & typeof Radio.defaultProps;

export default function ShippingMethod({
  shippingMethod,
  selectedShippingRate,
  methodDesc,
}: {
  shippingMethod?: { shippingMethods: ShippingArrayDataType[] };
  selectedShippingRate: string;
  methodDesc?: string;
}) {
  const { isSaving, saveCheckoutShipping } = useCheckout();
  const { showToast } = useCustomToast();
  const [isOpen, setIsOpen] = useState(true);

  const { control, handleSubmit } = useForm({
    mode: "onSubmit",
    defaultValues: {
      method: selectedShippingRate || "",
    },
  });

  const getShippingMethods = shippingMethod?.shippingMethods || [];

  const onSubmit = async (data: FieldValues) => {
    // ✅ this will now correctly send { method: "flat_rate_flat_rate" } etc.
    if (!data?.method) {
      showToast("Plese Choose the Shipping Method", "warning");

      return;
    }
    // setIsOpen(!isOpen);
    saveCheckoutShipping(data);
  };

  return (
    <div>
      {selectedShippingRate !== "" ? (
        isOpen ? (
          <div className="mt-4 flex justify-between">
            <div className="flex">
              <p className="w-[192px] text-base font-normal text-black/60 dark:text-white/60">
                Shipping Method
              </p>
              <p className="text-base font-normal">{methodDesc}</p>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer text-base font-normal text-black/[60%] underline dark:text-neutral-300"
            >
              Change
            </button>
          </div>
        ) : (
          <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              {isArray(getShippingMethods) && (
                <Controller
                  control={control}
                  name="method"
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      label=""
                      value={field.value} // controlled value
                      onValueChange={field.onChange} // update form
                    >
                      {getShippingMethods.map((method: any) => (
                        <CustomRadio
                          key={method?.methods?.code}
                          className="my-1 border border-solid border-neutral-300 dark:border-neutral-500"
                          description={method?.methods?.formattedBasePrice}
                          value={method?.methods?.code}
                        >
                          <span className="text-neutral-700 dark:text-white">
                            {method?.methods?.label}
                          </span>
                        </CustomRadio>
                      ))}
                    </RadioGroup>
                  )}
                />
              )}
            </div>

            <div className="my-6 justify-self-end">
              <ProceedToCheckout buttonName="Next" pending={isSaving} />
            </div>
          </form>
        )
      ) : (
        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            {isArray(getShippingMethods) && (
              <Controller
                control={control}
                name="method"
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    label=""
                    value={field.value} // controlled value
                    onValueChange={field.onChange} // update form
                  >
                    {getShippingMethods.map((method: any) => (
                      <CustomRadio
                        key={method?.methods?.code}
                        className="my-1 border border-solid border-neutral-300 dark:border-neutral-500"
                        description={method?.methods?.formattedBasePrice}
                        value={method?.methods?.code}
                      >
                        <span className="text-neutral-700 dark:text-white">
                          {method?.methods?.label}
                        </span>
                      </CustomRadio>
                    ))}
                  </RadioGroup>
                )}
              />
            )}
          </div>

          <div className="my-6 justify-self-end">
            <ProceedToCheckout buttonName="Next" pending={isSaving} />
          </div>
        </form>
      )}
    </div>
  );
}

const CustomRadio = (props: CustomRadioProps) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-transparent hover:bg-transparent items-center",
          "flex-row max-w-full cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary"
        ),
      }}
    >
      {children}
    </Radio>
  );
};
