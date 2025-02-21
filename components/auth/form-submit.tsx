"use client";

import { Mode } from "@/lib/constants";
import { useFormStatus } from "react-dom";

interface props {
  mode: Mode;
  state: {
    errors: unknown;
  };
  isLoading: boolean;
}

export default function FormSubmit({ mode, state, isLoading }: props) {
  const status = useFormStatus();

  state.errors = {};

  return (
    <button
      className="w-full p-2 cursor-pointer bg-[#4b34a9] text-[#d0cfd6] rounded hover:bg-[#432aa3]"
      disabled={status.pending || isLoading}
    >
      {status.pending
        ? "Processing..."
        : mode === Mode.login
        ? "Login"
        : "Create Account"}
    </button>
  );
}
