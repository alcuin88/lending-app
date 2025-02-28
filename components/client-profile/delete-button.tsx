"use client";

import { deleteLoan } from "@/actions/client-loan-payment.actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

export default function DeleteLoanButton({ loan_id }: { loan_id: number }) {
  const status = useFormStatus();
  const [state, formAction] = useActionState(() => deleteLoan(loan_id), {
    errors: [],
  });

  return (
    <form action={formAction}>
      <div className="flex justify-end space-x-4 mt-4">
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-blue-300">
          {status?.pending ? "Deleting..." : "Delete Loan"}
        </button>
      </div>
      {state?.errors && (
        <ul className="flex flex-col items-end">
          {state.errors.map((error) => (
            <li className="text-[#a21d4c] list-none" key={error}>
              {error}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
