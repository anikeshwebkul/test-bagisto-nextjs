"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { useForm } from "react-hook-form";

import { Button } from "../customer/login/loading-button";

import { userSubscribe } from "@/components/customer/lib/action";
import { RecoverPasswordFormState } from "@/components/customer/lib/types";

type FormValues = {
  email: string;
};

const Subscribe = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ mode: "onSubmit" });

  const [status, setStatus] = useState<
    RecoverPasswordFormState["errors"] | null
  >(null);

  const onSubmit = async (data: FormValues) => {
    setStatus(null);
    const formData = new FormData();

    formData.append("email", data.email);
    setLoading(true);
    const result = await userSubscribe(undefined as any, formData);

    setStatus(result?.errors || null);
    if (result?.errors?.apiRes?.status) {
      reset();
    }
    setLoading(false);
  };

  useEffect(() => {
    if (status) {
      setTimeout(() => {
        setStatus(null);
      }, 3500);
    }
  }, [status]);

  return (
    <form
      noValidate
      className="mt-4 md:mt-0 md:px-0"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="mb-1 text-base font-semibold">Newsletter</p>
      <p className="font-sm font-normal">
        Subscribe to our newsletter for exclusive offers!
      </p>

      <div className="mt-4 flex gap-x-3">
        <input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
            },
          })}
          className={clsx(
            "block rounded-2xl w-full xl:min-w-[283px] p-2.5 text-sm focus:border-blue-200 border border-neutral-200 bg-white  text-black outline-none placeholder:text-neutral-500 focus:ring-1 focus:ring-neutral-300 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400 ",
            errors.email || status?.email
              ? "border-red-500 dark:border-red-500"
              : "border-gray-300 dark:border-neutral-200"
          )}
          placeholder="Email Address"
        />
        <Button
          className={clsx(
            "relative flex font-medium w-full min-w-32 max-w-32 items-center justify-center !rounded-2xl border-1 border-solid border-neutral-600 bg-transparent px-5 py-2.5 font-outfit text-[15px]  tracking-wide dark:!text-white !text-neutral-600",
            {
              "hover:opacity-90": !isSubmitting,
              "cursor-not-allowed opacity-50": isSubmitting,
            }
          )}
          disabled={loading || isSubmitting}
          loading={loading || isSubmitting}
          title="Subscribe"
          type="submit"
        />
      </div>

      {errors.email && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {errors.email.message}
        </p>
      )}

      {status?.email && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {status.email[0]}
        </p>
      )}

      {status?.apiRes?.status === false && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {status.apiRes.msg}
        </p>
      )}

      {status?.apiRes?.status === true && (
        <p className="mt-2 text-sm text-green-600 dark:text-green-400">
          {status.apiRes.msg}
        </p>
      )}
    </form>
  );
};

export default Subscribe;
