"use client";

import { SubmitType } from "@/lib/constants";
import MyForm from "./my-form";
import { useState } from "react";

export default function FormToggle({ clientId }: { clientId: number }) {
  const [isLoan, setIsLoan] = useState(false);
  return (
    <div className="flex flex-col bg-white p-6 w-full max-w-2xl mt-4 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center mb-4 justify-end">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isLoan}
            onChange={() => setIsLoan(!isLoan)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-blue-500 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
        </label>
        <span className="ml-2 text-gray-700">{isLoan ? "Pay" : "Loan"}</span>
      </div>
      <MyForm
        client_id={clientId}
        type={isLoan ? SubmitType.payment : SubmitType.loan}
      />
    </div>
  );
}