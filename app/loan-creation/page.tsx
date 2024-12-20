"use client";

import { CreateLoan } from "@/actions/actions";
import FormSubmit from "@/components/loan-creation/form-submit";
import { useActionState } from "react";

export default function LoanCreation() {
  const [state, formAction] = useActionState(CreateLoan, {
    errors: [],
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Loan Creation</h1>
        <form action={formAction}>
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
              rows={5}
            />
          </div>
          <FormSubmit />
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
      </div>
    </div>
  );
}
