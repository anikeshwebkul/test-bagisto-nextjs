"use client";
import { useForm, UseFormRegister, FieldErrors } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EMAIL, getLocalStorage, setLocalStorage } from "@/store/local-storage";
import { delay } from "@/lib/utils";
import Link from "next/link";
import InputText from "./cart/input";
import { ProceedToCheckout } from "./cart/proceed-to-checkout";

type EmailFormValues = { email: string };

type EmailFormProps = {
  register: UseFormRegister<EmailFormValues>;
  errors: FieldErrors<EmailFormValues>;
  isSubmitting: boolean;
  isGuest: boolean;
};

const Email = ({
  userEmail,
  isGuest,
}: {
  userEmail?: string;
  isGuest: boolean;
}) => {
  const email = userEmail ?? getLocalStorage(EMAIL);
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormValues>({
    defaultValues: { email },
  });

  const onSubmit = async (data: EmailFormValues) => {
    setLocalStorage(EMAIL, data?.email);
    await delay(200);
    router.push("/checkout?step=address");
  };

  return (
    <>
      {email !== "" && isOpen ? (
        // 📌 Show static email view
        <div className="mt-4 flex justify-between">
          <div className="flex">
            <p className="w-[192px] text-base font-normal text-black/60 dark:text-white/60">
              Email Address
            </p>
            <p className="text-base font-normal">{email}</p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="cursor-pointer text-base font-normal text-black/[60%] underline dark:text-neutral-300"
          >
            Change
          </button>
        </div>
      ) : (
        // 📌 Show form
        <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
          <EmailForm
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            isGuest={isGuest}
          />
        </form>
      )}
    </>
  );
};

export default Email;

function EmailForm({
  register,
  errors,
  isSubmitting,
  isGuest,
}: EmailFormProps) {
  return (
    <div>
      <InputText
        className="max-w-full"
        id="email"
        size="md"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email format",
          },
        })}
        errorMsg={errors?.email?.message as string}
        label="Enter Email *"
        placeholder="example@gmail.com"
        readOnly={!isGuest}
      />

      {isGuest && (
        <p className="mb-4 mt-6 font-outfit text-base font-normal text-black/[60%] dark:text-neutral-300">
          Already have an account? No worries, just{" "}
          <Link
            className="text-base font-normal text-primary"
            href="/customer/login"
          >
            log in.
          </Link>
        </p>
      )}

      <div className="mt-6 justify-self-end">
        <ProceedToCheckout buttonName="Next" pending={isSubmitting} />
      </div>
    </div>
  );
}
