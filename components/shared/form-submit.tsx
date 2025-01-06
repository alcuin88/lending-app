"use client";

import { SubmitType } from "@/lib/constants";
import { useFormStatus } from "react-dom";

export default function FormSubmit({ type }: { type: SubmitType }) {
  const status = useFormStatus();

  let buttonLabel = "";

  if (type === SubmitType.loan) {
    buttonLabel = "Create Loan";
  } else if (type === SubmitType.payment) {
    buttonLabel = "Post Payment";
  }

  if (status.pending && type === SubmitType.loan) {
    return <span>Creating loan...</span>;
  } else if (status.pending && type === SubmitType.payment) {
    return <span>Posting payment...</span>;
  }

  return (
    <div className="flex justify-end space-x-4 mt-4">
      <button
        type="reset"
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-500"
      >
        Reset
      </button>
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
        {buttonLabel}
      </button>
    </div>
  );
}
