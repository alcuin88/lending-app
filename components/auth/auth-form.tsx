"use client";

import { formSelect } from "@/actions/auth-actions";
import Link from "next/link";
import { useActionState, useTransition } from "react";
import logo from "@/public/images/auth-icon.jpg";
import { Mode } from "@/lib/constants";
import Image from "next/image";
import FormSubmit from "./form-submit";
import { useRouter } from "next/navigation";

export default function AuthForm({ mode }: { mode: Mode }) {
  // const [state, formState] = useActionState(formSelect.bind(null, mode), {
  //   errors: {},
  // });

  const [state, formState] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      return await formSelect(mode, null, formData);
    },
    { errors: {} }
  );

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function errorCheck(key: string) {
    if (state?.errors?.[key as keyof typeof state.errors]) {
      const errorMessage: [] = state.errors[key as keyof typeof state.errors];

      return (
        <div className="text-[#a21d4c] list-none">
          <ul>
            {errorMessage.map((error) => {
              return <li key={error}>{error}</li>;
            })}
          </ul>
        </div>
      );
    }
  }

  return (
    <form
      action={formState}
      className="w-[90%] max-w-2xl rounded-lg p-12 mx-auto mt-20 md:bg-gray-400 md:shadow-lg"
    >
      <div className="flex justify-center">
        <Image
          src={logo}
          alt="A lock icon"
          priority
          className="w-24 h-24 rounded-full drop-shadow-md"
        />
      </div>
      <p className="mb-4">
        <label htmlFor="email" className="block mb-1 font-bold text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="w-full p-2 rounded bg-gray-300 text-gray-700 border-none"
        />
      </p>

      {errorCheck("email")}
      <p>
        <label
          htmlFor="password"
          className="block mb-1 font-bold text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          className="w-full p-2 rounded bg-gray-300 text-gray-700 border-none"
        />
      </p>

      {errorCheck("password")}

      <FormSubmit mode={mode} state={state} isLoading={isPending} />
      {errorCheck("error")}
      <p className="text-center mt-4">
        {mode === Mode.login && (
          <Link
            onClick={(e) => {
              e.preventDefault();
              startTransition(() => {
                router.push(`/?mode=${Mode.signup}`);
              });
            }}
            href={`/?mode=${Mode.signup}`}
            className="text-purple-900 hover:text-purple-700"
          >
            {isPending ? "Switching..." : "Create an account."}
          </Link>
        )}
        {mode === Mode.signup && (
          <Link
            onClick={(e) => {
              e.preventDefault();
              startTransition(() => {
                router.push(`/?mode=${Mode.login}`);
              });
            }}
            href={`/?mode=${Mode.login}`}
            className="text-purple-900 hover:text-purple-700"
          >
            {isPending ? "Switching..." : "Login with existing account."}
          </Link>
        )}
      </p>
    </form>
  );
}
