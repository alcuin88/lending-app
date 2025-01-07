"use client";

import { SubmitType } from "@/lib/constants";
import FormSubmit from "../shared/form-submit";
import { useActionState } from "react";
import { formControl } from "@/actions/actions";

interface props {
  type: SubmitType;
  client_id?: number;
  loan_id?: number;
}

export default function MyForm({ type, client_id, loan_id }: props) {
  const [state, formState] = useActionState(formControl, {
    errors: [],
  });

  const header = type === SubmitType.loan ? "Add Loan" : "Add Payment";
  return (
    <div className="flex flex-col bg-white p-6 w-full max-w-2xl mt-4 rounded-lg shadow-md border border-gray-200">
      <div className="flex w-full items-center justify-center mb-2 font-bold">
        <h1>{header}</h1>
      </div>
      <form action={formState} className="flex flex-col">
        <input
          type="hidden"
          id="client_id"
          name="client_id"
          value={client_id}
        />
        <input type="hidden" id="loan_id" name="loan_id" value={loan_id} />
        <input type="hidden" id="formType" name="formType" value={type} />
        <div className="form-control">
          <label className="block font-bold mb-2" htmlFor="date">
            Date
          </label>
          <input
            className="w-full border rounded p-2"
            type="date"
            id="date"
            name="date"
          ></input>
        </div>

        <div className="form-control">
          <label className="block font-bold mb-2" htmlFor="amount">
            Amount
          </label>
          <input
            className="w-full border rounded p-2"
            type="text"
            id="amount"
            name="amount"
          ></input>
        </div>

        <div className="form-control">
          <label className="block font-bold mb-2" htmlFor="remarks">
            Remarks
          </label>
          <textarea
            className="w-full border rounded p-2"
            name="remarks"
            id="remarks"
            rows={2}
          />
        </div>

        <FormSubmit type={type} />
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
  );
}