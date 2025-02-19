import { Client, Loan, Payment } from "@/lib/interface";
import { notFound } from "next/navigation";

interface props {
  client: Client;
  loan: Loan;
  payments: Payment[];
}

export default async function LoanDetailCard({
  loan,
  payments,
  client,
}: props) {
  if (!loan) {
    notFound();
  }

  const status = loan.status ? (
    <div className="bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
      <p className="text-green-700">{loan.status}</p>
    </div>
  ) : (
    <div className="bg-red-100 px-3 py-1 rounded-full text-sm font-medium">
      <p className="text-red-700">Inactive</p>
    </div>
  );

  return (
    <div className="flex flex-col bg-white p-6 w-full max-w-2xl mt-4 rounded-lg shadow-md border border-gray-200">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">{`${client.last_name}, ${client.first_name}`}</h2>
          <p className="text-sm text-gray-500">{`Loan ID: ${loan.loan_id
            .toString()
            .padStart(5, "0")}`}</p>
        </div>
        {status}
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-800">Loan Amount:</span> ₱{" "}
          {new Intl.NumberFormat().format(loan.amount)}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-800">Total Payments:</span> ₱{" "}
          {new Intl.NumberFormat().format(payments.length)}
        </p>
      </div>

      <div className="flex items-center justify-between bg-blue-100 text-blue-800 p-4 rounded-lg mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold">Remaining Balance:</span>
          <span className="text-2xl font-extrabold">
            ₱ {new Intl.NumberFormat().format(loan.balance)}
          </span>
        </div>
        <span className="text-xl">💰</span>
      </div>

      <div>
        <label className="block font-bold mb-2" htmlFor="remarks">
          Purpose
        </label>
        <textarea
          className="w-full border rounded p-2 pointer-events-none"
          id="remarks"
          rows={2}
          readOnly
          value={loan.purpose || ""}
        />
      </div>
    </div>
  );
}
