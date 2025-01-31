"use client";

import { auth } from "@/actions/auth-actions";
import Link from "next/link";
import { useActionState } from "react";
import logo from "@/public/images/auth-icon.jpg";
import { Mode } from "@/lib/constants";
import Image from "next/image";

export default function AuthForm({ mode }: { mode: Mode }) {
  const [state, formState] = useActionState(auth.bind(null, mode), {
    errors: {},
  });
  return (
    <form action={formState} id="auth-form">
      <div>
        <Image src={logo} alt="A lock icon" />
      </div>
      <p>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
      </p>
      {state?.errors?.["email" as keyof typeof state.errors] && (
        <p id="form-errors">
          {state.errors["email" as keyof typeof state.errors]}
        </p>
      )}
      <p>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </p>
      {state?.errors?.["password" as keyof typeof state.errors] && (
        <div id="form-errors">
          <p>Password must:</p>
          <ul>
            {Object.keys(state.errors).map((error) => {
              if (error === "password") {
                return (
                  <li key={error}>
                    {state.errors[error as keyof typeof state.errors]}
                  </li>
                );
              }
            })}
          </ul>
        </div>
      )}
      {mode === Mode.login ? (
        <ul id="form-errors">
          {state?.errors &&
            Object.keys(state.errors).map((error) => (
              <li key={error}>
                {state.errors[error as keyof typeof state.errors]}
              </li>
            ))}
        </ul>
      ) : null}
      <p>
        <button type="submit">
          {mode === Mode.login ? "Login" : "Create Account"}
        </button>
      </p>
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
