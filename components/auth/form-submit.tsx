"use client";

import { Mode } from "@/lib/constants";
import { useFormStatus } from "react-dom";

export default function FormSubmit({ mode }: { mode: Mode }) {
  const status = useFormStatus();

  if (status.pending) {
    return <p>Logging in</p>;
  }

  return <button>{mode === Mode.login ? "Login" : "Create Account"}</button>;
}
