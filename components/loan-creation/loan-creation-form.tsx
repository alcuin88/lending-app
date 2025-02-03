"use client";

import FormSubmit from "@/components/shared/form-submit";
import { SubmitType } from "@/lib/constants";
import { CreateLoan } from "@/actions/loan-creation.form.actions";
import { useActionState } from "react";

export default function LoanCreationForm({ token }: { token: string }) {
  const [state, formAction] = useActionState(CreateLoan, {
    errors: [],
  });
  return (
    <form action={formAction}>
      <input type="hidden" value={token} id="token" name="token" />
      <div className="form-control mb-4">
        <label className="block font-bold mb-2" htmlFor="first-name">
          First Name
        </label>

        <input
          className="w-full border rounded p-2"
          type="text"
          id="first-name"
          name="first-name"
        />
      </div>
      <div className="form-control mb-4">
        <label className="block font-bold mb-2" htmlFor="last-name">
          Last Name
        </label>
        <input
          className="w-full border rounded p-2"
          type="text"
          id="last-name"
          name="last-name"
        />
      </div>
      <div className="form-control mb-4">
        <label className="block font-bold mb-2" htmlFor="amount">
          Amount
        </label>
        <input
          className="w-full border rounded p-2"
          type="text"
          id="amount"
          name="amount"
        />
      </div>
      <div className="form-control mb-4">
        <label className="block font-bold mb-2" htmlFor="purpose">
          Purpose
        </label>
        <textarea
          className="w-full border rounded p-2"
          name="purpose"
          id="purpose"
          rows={5}
        />
      </div>
      <FormSubmit type={SubmitType.loan} />
      {state?.errors && (
        <ul className="flex flex-col items-end">
          {state.errors.map((error) => (
            <li className="my-1.5 text-[#F4511E]" key={error}>
              {error}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
