"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { addCheckoutAddress, updateCustomerAddress } from "@/lib/bagisto";
import { TAGS } from "@/lib/constants";
import { isObject } from "@/lib/type-guards";

export async function createCheckoutAddress(prev: any, formData: FormData) {
  const addressData = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    companyName: formData.get("companyName"),
    address: formData.get("address"),
    country: formData.get("country") || "IN",
    state: formData.get("state") || "UP",
    city: formData.get("city"),
    postcode: formData.get("postcode"),
    phone: formData.get("phone"),
    useForShipping:
      formData.get("useForShipping") == null
        ? Boolean(formData.get("saveAddress"))
        : false,
    saveAddress:
      formData.get("saveAddress") !== null
        ? Boolean(formData.get("saveAddress"))
        : false,
  };

  const cookiresStore = await cookies();
  const userEmail = cookiresStore.get("email")?.value;
  const checkoutInfo = {
    input: {
      billing: {
        ...addressData,
        defaultAddress: false,
        email: userEmail,
      },
      shipping: {
        ...addressData,
        defaultAddress: false,
        email: userEmail,
      },
    },
  };

  const result = await addCheckoutAddress({ ...checkoutInfo });

  if (isObject(result)) {
    const cart = result.cart as { isGuest?: boolean };

    if (!cart.isGuest) {
      revalidateTag(TAGS.address);
    }

    revalidateTag(TAGS.cart);
  }
}

export async function proccedCheckoutAddress(formData: any) {
  const result = await addCheckoutAddress({ ...formData });
  // console.log(result?.cart);
  if (isObject(result?.cart)) {
    return {
      succsess: true,
      error: {},
      data: result?.cart,
    };
  }

  // if (isObject(result)) {
  //   revalidateTag(TAGS.cart);
  //   redirect("/checkout/information?step=shipping");
  // }
}

export async function updateAddress(prevState: any, formData: FormData) {
  const addressData = {
    email: formData.get("email"),
    id: formData.get("id"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    companyName: formData.get("companyName") || "India",
    address: formData.get("address"),
    country: formData.get("country") || "IN",
    state: formData.get("state") || "UP",
    city: formData.get("city"),
    postcode: formData.get("postcode"),
    phone: formData.get("phone"),
    defaultAddress: false,
  };

  // const validatedFields = schema.safeParse({
  //   ...addressData,
  // });

  // if (!validatedFields.success) {
  //   return {
  //     errors: validatedFields.error.flatten().fieldErrors,
  //   };
  // }

  const { id, ...inputWithoutId } = addressData;
  const result = await updateCustomerAddress({
    id: id,
    input: {
      ...inputWithoutId,
    },
  });

  if (isObject(result?.updateAddress)) {
    revalidateTag(TAGS.address);

    return {
      errors: {},
      data: result?.updateAddress,
    };
  }
}
