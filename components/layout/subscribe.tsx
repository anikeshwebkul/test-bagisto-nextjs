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
      className="mt-4 px-2 md:mt-0 md:px-0"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="mb-1 text-base font-semibold">Newsletter</h1>
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
            "block w-full rounded-lg border bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400",
            errors.email || status?.email
              ? "border-red-500 dark:border-red-500"
              : "border-gray-300 dark:border-gray-600",
          )}
          placeholder="Email Address"
        />
        <Button
          className={clsx(
            "relative flex  w-full  min-w-32 max-w-32 items-center justify-center rounded-xl border border-solid border-neutral-300 bg-transparent px-2 py-2 font-outfit text-base font-semibold tracking-wide !text-neutral-500  ",
            {
              "hover:opacity-90": !isSubmitting,
              "cursor-not-allowed opacity-50": isSubmitting,
            },
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
