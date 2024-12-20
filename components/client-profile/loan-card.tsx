import { loan } from "@/types/types";

export default function LoanCard({ loan }: { loan: loan }) {
  return (
    <div className="flex flex-col bg-white p-4 rounded-lg shadow-lg w-full max-w-md mt-2">
      <div className="flex justify-between text-gray-500 text-xs">
        <p>Created: {loan.created_at}</p>
        {loan.closed_at ? <p>Paid: {loan.closed_at}</p> : null}
      </div>
      <div className="flex items-center">
        <p className="text-2xl font-semibold ml-2 mr-2 w-2/5">{`₱ ${new Intl.NumberFormat().format(
          loan.amount
        )}`}</p>
        <p className="text-sm text-gray-700 w-3/5">{loan.purpose}</p>
      </div>
    </div>
  );
}
