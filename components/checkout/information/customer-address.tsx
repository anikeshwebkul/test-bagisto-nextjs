"use client";
import { FC, useState } from "react";
import { Checkbox } from "@heroui/checkbox";
import { cn } from "@heroui/theme";

import { proccedCheckoutAddress } from "../action";
import { ProceedToCheckout } from "../cart/proceed-to-checkout";

import AddAdressForm from "./add-address-form";
import EditAddressForm from "./edit-address-form";

import { EditIcon } from "@/components/icons/edit-icon";
import { MapIcon } from "@/components/icons/map-icon";
import PlusIcon from "@/components/icons/plus-icon";
import {
  AddressDataTypes,
  CountryArrayDataType,
  EditItemTypes,
} from "@/lib/bagisto/types";
import { isArray, isObject } from "@/lib/type-guards";
import { extractAddress } from "@/lib/utils";
import { FieldValues, useForm } from "react-hook-form";
import { useCustomToast } from "@/components/hooks/use-toast";
import { useRouter } from "next/navigation";

const CustomerAddress: FC<{
  addresses: {
    customer: {
      addresses?: AddressDataTypes[];
    };
  };
  countries: CountryArrayDataType[];
  billingAddress?: AddressDataTypes;
  shippingAddress?: AddressDataTypes;
}> = ({ addresses, billingAddress, shippingAddress, countries }) => {
  const [isSelected, setIsSelected] = useState(
    isObject(billingAddress)
      ? billingAddress?.useForShipping
        ? true
        : false
      : true
  );

  const { showToast } = useCustomToast();
  const router = useRouter();
  const [selectedBillingId, setSelectedBillingId] = useState<string | null>(
    null
  );
  const [selectedShippingId, setSelectedShippingId] = useState<string | null>(
    null
  );

  const [buttoionAction, setItem] = useState<EditItemTypes>({
    state: false,
    type: "edit",
    label: "Billing",
  });

  const shippingAllAddress = addresses?.customer?.addresses;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      useForShipping: true,
      billingAddressId: "",
      shippingAddressId: "",
    },
  });

  const formAction = async (formData: FieldValues) => {
    // Get selected Address IDs
    const billingId = formData?.billingAddressId;
    const shippingId = formData?.shippingAddressId;

    const useForShipping = formData.useForShipping;
    if (!billingId && billingId === null) {
      showToast("Please Select the billing Address", "warning");
      return;
    }

    if (!useForShipping && !shippingId && shippingId === null) {
      showToast("Please Select the shippping Address", "warning");
    }

    // Find billing address or fallback to billingAddressTemp
    const getBillingAddress =
      shippingAllAddress?.find((item) => item.id == billingId) ??
      billingAddress;
    // Find shipping address or fallback to shippingAddress
    const getShippingAddress =
      shippingAllAddress?.find((item) => item.id == shippingId) ??
      shippingAddress;

    // Prepare inputs
    const inputs = {
      input: {
        billing: extractAddress(getBillingAddress),
        shipping: useForShipping
          ? extractAddress(getBillingAddress)
          : extractAddress(getShippingAddress),
      },
    };

    await proccedCheckoutAddress(inputs)
      .then((res) => {
        if (res?.succsess) {
          showToast("Add Address Successfully", "success");
          router.replace("/checkout?step=shipping");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="mt-5">
      <div className="min-h-12 mb-4 flex items-center justify-between max-md:mb-2">
        <h2 className="text-xl font-medium max-sm:text-base max-sm:font-normal">
          {buttoionAction?.state
            ? `${buttoionAction.label} Address`
            : "Billing Address"}
        </h2>
        <button
          className={cn(
            "hidden rounded-xl bg-blue-600 px-4 py-1.5 text-white",
            buttoionAction?.state ? "block" : "hidden"
          )}
          color="primary"
          type="button"
          onClick={() =>
            setItem({
              state: false,
              type: "edit",
              label: "Billing",
            })
          }
        >
          Back
        </button>
      </div>

      {buttoionAction?.state &&
      buttoionAction.type === "edit" &&
      isObject(buttoionAction.address) ? (
        <EditAddressForm
          countries={countries}
          setItem={setItem}
          shippingAdress={buttoionAction.address}
        />
      ) : buttoionAction?.state &&
        buttoionAction.type === "add" &&
        !isObject(buttoionAction.address) ? (
        <AddAdressForm countries={countries} />
      ) : (
        <form onSubmit={handleSubmit(formAction)}>
          <div className="grid grid-cols-2 gap-4">
            {isArray(shippingAllAddress)
              ? shippingAllAddress?.map((item) => (
                  <div
                    key={item.id}
                    className="inline-flex flex-col rounded-xl border border-neutral-900 px-2 py-3"
                  >
                    <div className="flex flex-row-reverse items-center justify-between">
                      <div className="flex gap-x-2.5">
                        <label
                          className="relative flex cursor-pointer items-center"
                          htmlFor={`billing_${item.id}`}
                        >
                          <input
                            checked={selectedBillingId === item.id}
                            {...register("billingAddressId")}
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 transition-all checked:border-slate-400"
                            id={`billing_${item.id}`}
                            type="radio"
                            value={item.id}
                            onChange={() => setSelectedBillingId(item.id)}
                          />
                          <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-slate-800 opacity-0 transition-opacity duration-200 peer-checked:opacity-100" />
                        </label>
                        <button
                          aria-label="Edit"
                          // className="bg-white !px-0"
                          color="default"
                          onClick={() =>
                            setItem({
                              state: true,
                              label: "Billing",
                              type: "edit",
                              address: item,
                            })
                          }
                        >
                          <EditIcon className="size-[23px]" />
                        </button>
                      </div>
                      <MapIcon className="!size-8 stroke-black dark:stroke-white" />
                    </div>

                    <label
                      className="block cursor-pointer rounded-xl p-2 max-sm:rounded-lg"
                      htmlFor={`billing_${item.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-base font-medium">
                          {`${item?.firstName || ""} ${item?.lastName || ""} (${
                            item?.companyName || ""
                          })`}
                        </p>
                      </div>
                      <p className="mt-2 text-sm text-zinc-500 max-md:mt-2 max-sm:mt-0">
                        {`${item?.address}, ${item?.city}, ${item?.state}, ${item?.countryName}, ${item?.postcode}`}
                      </p>
                    </label>
                  </div>
                ))
              : null}
            {/* Billing Addresss */}
            {isObject(billingAddress) ? (
              <div
                key={billingAddress.id}
                className="inline-flex flex-col rounded-xl border border-neutral-900 px-2 py-3"
              >
                <div className="flex flex-row-reverse items-center justify-between">
                  <div className="flex gap-x-2.5">
                    <label
                      className="relative flex cursor-pointer items-center"
                      htmlFor={`billing_${billingAddress.id}`}
                    >
                      <input
                        checked={selectedBillingId === billingAddress.id}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 transition-all checked:border-slate-400"
                        id={`billing_${billingAddress.id}`}
                        name="billingAddressId"
                        type="radio"
                        value={billingAddress.id}
                        onChange={() => setSelectedBillingId(billingAddress.id)}
                      />
                      <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-slate-800 opacity-0 transition-opacity duration-200 peer-checked:opacity-100" />
                    </label>
                    <button
                      aria-label="Edit"
                      // className="bg-white !px-0"
                      color="default"
                      onClick={() =>
                        setItem({
                          state: true,
                          type: "edit",
                          label: "Billing",
                          address: billingAddress,
                        })
                      }
                    >
                      <EditIcon className="size-[23px]" />
                    </button>
                  </div>
                  <MapIcon className="!size-8 stroke-black dark:stroke-white" />
                </div>

                <label
                  className="block cursor-pointer rounded-xl p-2 max-sm:rounded-lg"
                  htmlFor={`billing_${billingAddress.id}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-base font-medium">
                      {`${billingAddress?.firstName || ""} ${billingAddress?.lastName || ""} (${
                        billingAddress?.companyName || ""
                      })`}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-zinc-500 max-md:mt-2 max-sm:mt-0">
                    {`${billingAddress?.address}, ${billingAddress?.city}, ${billingAddress?.state}, ${billingAddress?.countryName}, ${billingAddress?.postcode}`}
                  </p>
                </label>
              </div>
            ) : (
              <div className="min-h-28 flex items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-900">
                <button
                  type="button"
                  onClick={() =>
                    setItem({
                      state: true,
                      type: "add",
                      label: "Billing",
                    })
                  }
                >
                  <PlusIcon />
                </button>
              </div>
            )}
          </div>
          <Checkbox
            className="my-2"
            color="primary"
            isSelected={isSelected}
            {...register("useForShipping")}
            onValueChange={setIsSelected}
          >
            <span className="text-neutral-400 dark:text-white">
              Use same address for shipping
            </span>
          </Checkbox>
          {!isSelected && (
            <div>
              <div className="mb-4 flex items-center justify-between max-md:mb-2">
                <h2 className="text-xl font-medium max-sm:text-base max-sm:font-normal">
                  Shipping Address
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {isArray(shippingAllAddress)
                  ? shippingAllAddress?.map((item) => (
                      <div
                        key={item.id}
                        className="inline-flex flex-col rounded-xl border border-solid px-2 py-3"
                      >
                        <div className="flex flex-row-reverse items-center justify-between">
                          <div className="flex gap-x-2.5">
                            <label
                              className="relative flex cursor-pointer items-center"
                              htmlFor={`shipping_${item.id}`}
                            >
                              <input
                                checked={selectedShippingId === item.id}
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 transition-all checked:border-slate-400"
                                id={`shipping_${item.id}`}
                                {...register("shippingAddressId")}
                                type="radio"
                                value={item.id}
                                onChange={() => setSelectedShippingId(item.id)}
                              />
                              <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-slate-800 opacity-0 transition-opacity duration-200 peer-checked:opacity-100" />
                            </label>
                            <button
                              aria-label="Edit"
                              // className="bg-white !px-0"
                              color="default"
                              type="button"
                              onClick={() =>
                                setItem({
                                  state: true,
                                  label: "Shipping",
                                  type: "edit",
                                  address: item,
                                })
                              }
                            >
                              <EditIcon className="size-[23px]" />
                            </button>
                          </div>
                          <MapIcon className="!size-8 stroke-black dark:stroke-white" />
                        </div>
                        <label
                          className="block cursor-pointer rounded-xl p-2 max-sm:rounded-lg"
                          htmlFor={`shipping_${item.id}`}
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-base font-medium">
                              {`${item?.firstName || ""} ${item?.lastName || ""} (${
                                item?.companyName || ""
                              })`}
                            </p>
                          </div>
                          <p className="mt-2 text-sm text-zinc-500 max-md:mt-2 max-sm:mt-0">
                            {`${item?.address}, ${item?.city}, ${item?.state}, ${item?.countryName}, ${item?.postcode}`}
                          </p>
                        </label>
                      </div>
                    ))
                  : null}
                {isObject(shippingAddress) ? (
                  <div
                    key={shippingAddress.id}
                    className="inline-flex flex-col rounded-xl border border-solid px-2 py-3"
                  >
                    <div className="flex flex-row-reverse items-center justify-between">
                      <div className="flex gap-x-2.5">
                        <label
                          className="relative flex cursor-pointer items-center"
                          htmlFor={`shipping_${shippingAddress.id}`}
                        >
                          <input
                            checked={selectedShippingId === shippingAddress.id}
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 transition-all checked:border-slate-400"
                            id={`shipping_${shippingAddress.id}`}
                            name="shippingAddressId"
                            type="radio"
                            value={shippingAddress.id}
                            onChange={() =>
                              setSelectedShippingId(shippingAddress.id)
                            }
                          />
                          <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-slate-800 opacity-0 transition-opacity duration-200 peer-checked:opacity-100" />
                        </label>
                        <button
                          aria-label="Edit"
                          // className="bg-white !px-0"
                          color="default"
                          type="button"
                          onClick={() =>
                            setItem({
                              state: true,
                              type: "edit",
                              label: "Shipping",
                              address: shippingAddress,
                            })
                          }
                        >
                          <EditIcon className="size-[23px]" />
                        </button>
                      </div>
                      <MapIcon className="!size-8 stroke-black dark:stroke-white" />
                    </div>
                    <label
                      className="block cursor-pointer rounded-xl p-2 max-sm:rounded-lg"
                      htmlFor={`shipping_${shippingAddress.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-base font-medium">
                          {`${shippingAddress?.firstName || ""} ${
                            shippingAddress?.lastName || ""
                          } (${shippingAddress?.companyName || ""})`}
                        </p>
                      </div>
                      <p className="mt-2 text-sm text-zinc-500 max-md:mt-2 max-sm:mt-0">
                        {`${shippingAddress?.address}, ${shippingAddress?.city}, ${shippingAddress?.state}, ${shippingAddress?.countryName}, ${shippingAddress?.postcode}`}
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="min-h-28 flex items-center justify-center rounded-xl border border-solid">
                    <button
                      type="button"
                      onClick={() =>
                        setItem({
                          state: true,
                          type: "add",
                          label: "Shipping",
                        })
                      }
                    >
                      <PlusIcon />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="justify-self-end">
            <ProceedToCheckout buttonName="Next" pending={isSubmitting} />
          </div>
        </form>
      )}
    </div>
  );
};

export default CustomerAddress;
