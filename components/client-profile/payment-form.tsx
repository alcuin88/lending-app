import { SubmitType } from "@/lib/constants";
import FormSubmit from "../shared/form-submit";

export default function PaymentForm() {
  return (
    <div className="flex flex-col bg-white p-6 w-full max-w-2xl mt-4 rounded-lg shadow-md border border-gray-200">
      <form className="flex flex-col">
        <input className="w-full border rounded p-2" type="date"></input>
        <label className="block font-bold mb-2" htmlFor="amount">
          Amount
        </label>
        <input className="w-full border rounded p-2" type="text"></input>
        <label className="block font-bold mb-2" htmlFor="purpose">
          Remarks
        </label>
        <textarea
          className="w-full border rounded p-2"
          name="purpose"
          rows={3}
        />
        <FormSubmit type={SubmitType.payment} />
      </form>
    </div>
  );
}
