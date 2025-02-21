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
    <form
      action={formAction}
      className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
    >
      <input type="hidden" value={token} id="token" name="token" />

      {/* First Name */}
      <div className="mb-4">
        <label
          className="block font-bold mb-1 text-gray-700"
          htmlFor="first-name"
        >
          First Name
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          id="first-name"
          name="first-name"
          required
        />
      </div>

      {/* Last Name */}
      <div className="mb-4">
        <label
          className="block font-bold mb-1 text-gray-700"
          htmlFor="last-name"
        >
          Last Name
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          id="last-name"
          name="last-name"
          required
        />
      </div>

      {/* Loan Amount */}
      <div className="mb-4">
        <label className="block font-bold mb-1 text-gray-700" htmlFor="amount">
          Amount
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
          id="amount"
          name="amount"
          min="0"
          required
        />
      </div>

      {/* Purpose */}
      <div className="mb-4">
        <label className="block font-bold mb-1 text-gray-700" htmlFor="purpose">
          Purpose
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="purpose"
          id="purpose"
          rows={4}
          required
        />
      </div>

      {/* Submit Button */}
      <FormSubmit type={SubmitType.loan} />

      {/* Error Messages */}
      {state?.errors && (
        <ul className="mt-4 text-right">
          {state.errors.map((error) => (
            <li className="text-red-600 list-none text-sm" key={error}>
              {error}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
