"use client";

import { auth } from "@/actions/auth-actions";
import Link from "next/link";
import { useActionState } from "react";
import logo from "@/assets/images/auth-icon.jpg";

export default function AuthForm({ mode }: { mode: string }) {
  const [state, formState] = useActionState(auth.bind(null, mode), {
    errors: {},
  });
  return (
    <form action={formState} id="auth-form">
      <div>
        <img src={logo.src} alt="A lock icon" />
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
      {mode === "login" ? (
        <ul id="form-errors">
          {Object.keys(state.errors).map((error) => (
            <li key={error}>
              {state.errors[error as keyof typeof state.errors]}
            </li>
          ))}
        </ul>
      ) : null}
      <p>
        <button type="submit">
          {mode === "login" ? "Login" : "Create Account"}
        </button>
      </p>
      <p>
        {mode === "login" && (
          <Link href="/?mode=signup">Create an account.</Link>
        )}
        {mode === "signup" && (
          <Link href="/?mode=login">Login with existing account.</Link>
        )}
      </p>
    </form>
  );
}
