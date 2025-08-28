"use client";
import { FC, useActionState, useState } from "react";
import { Checkbox } from "@heroui/checkbox";

import { createCheckoutAddress } from "../action";
import InputText from "../cart/input";
import { ProceedToCheckout } from "../cart/proceed-to-checkout";
import SelectBox from "../select-filed";

import { CountryArrayDataType } from "@/lib/bagisto/types";
import RegionDropDown from "@/components/checkout/region-drop-down";

const AddAdressForm: FC<{
  countries: CountryArrayDataType[] | null;
}> = ({ countries }) => {
  const [isSelected, setIsSelected] = useState(true);

  const [state, formAction] = useActionState(createCheckoutAddress, null);

  return (
    <>
      <form action={formAction} className="my-5">
        <div className="my-7 grid grid-cols-6 gap-4">
          <InputText
            className="col-span-3"
            name="firstName"
            // errorMsg={state?.errors?.firstName}
            label="First Name *"
          />
          <InputText
            className="col-span-3"
            name="lastName"
            // errorMsg={state?.errors?.lastName}
            label="Last Name *"
          />
          <InputText
            className="col-span-6"
            label="Company Name"
            name="companyName"
          />
          <InputText
            className="col-span-6"
            name="address"
            label="Street Address *"
            // errorMsg={state?.errors?.address}
          />

          <SelectBox
            className="col-span-3"
            countries={countries}
            nameAttr="country"
            defaultValue={"AI"}
            // errorMsg={state?.errors?.country}
            label="Country/Region *"
          />
          <RegionDropDown
            className="col-span-3 sm:col-span-3"
            label="State *"
            countries={countries}
            // errorMsg={state?.errors?.state}
            name="state"
          />
          <InputText className="col-span-3" label="City *" name="city" />
          <InputText
            className="col-span-3"
            label="Zip Code *"
            name="postcode"
          />
          <InputText className="col-span-6" label="Phone *" name="phone" />
          <Checkbox
            className="col-span-6"
            color="primary"
            isSelected={isSelected}
            name="saveAddress"
            value={isSelected ? "1" : "0"}
            onValueChange={setIsSelected}
          >
            <span className="text-neutral-400 dark:text-white">
              Save this to address book
            </span>
          </Checkbox>
        </div>

        <div className="justify-self-end">
          <ProceedToCheckout
            buttonName="Continue to shipping"
            pending={false}
          />
        </div>
      </form>
    </>
  );
};

export default AddAdressForm;
