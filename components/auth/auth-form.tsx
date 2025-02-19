"use client";

import { formSelect } from "@/actions/auth-actions";
import Link from "next/link";
import { useActionState } from "react";
import logo from "@/public/images/auth-icon.jpg";
import { Mode } from "@/lib/constants";
import Image from "next/image";
import FormSubmit from "./form-submit";

export default function AuthForm({ mode }: { mode: Mode }) {
  const [state, formState] = useActionState(formSelect.bind(null, mode), {
    errors: {},
  });

  function errorCheck(key: string) {
    if (state?.errors?.[key as keyof typeof state.errors]) {
      const errorMessage: [] = state.errors[key as keyof typeof state.errors];

      return (
        <div className="text-red-700">
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
    <form action={formState} id="auth-form">
      <div>
        <Image src={logo} alt="A lock icon" priority />
      </div>
      <p>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
      </p>

      {errorCheck("email")}
      <p>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </p>

      {errorCheck("password")}

      <FormSubmit mode={mode} />
      {errorCheck("error")}
      <p>
        {mode === Mode.login && (
          <Link href={`/?mode=${Mode.signup}`}>Create an account.</Link>
        )}
        {mode === Mode.signup && (
          <Link href={`/?mode=${Mode.login}`}>
            Login with existing account.
          </Link>
        )}
      </p>
    </form>
  );
}
