"use client";

import { useFormStatus } from "react-dom";

export default function FormSubmit() {
  const status = useFormStatus();

  if (status.pending) {
    return <span>Creating loan...</span>;
  }

  return (
    <div className="flex justify-end space-x-4">
      <button
        type="reset"
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-500"
      >
        Reset
      </button>
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
        Create Loan
      </button>
    </div>
  );
}
