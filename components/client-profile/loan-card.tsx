import { loan } from "@/types/types";

export default function LoanCard({ loan }: { loan: loan }) {
  loan.closed_at = "2024-2-2";
  return (
    <div className="flex flex-col bg-sky-50 p-4 rounded-lg shadow-lg w-full mt-2">
      <div className="flex items-start">
        <p className="text-sm text-gray-500 mr-2 w-1/5">{`Load ID: ${loan.loan_id
          .toString()
          .padStart(5, "0")}`}</p>
        <div className="flex flex-col text-gray-500 text-xs mb-2 text-right ml-auto">
          <p>{`Date: ${loan.created_at}`}</p>
          {loan.closed_at && <p>{`Paid: ${loan.closed_at}`}</p>}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-sm text-gray-700 w-2/5 text-left">{loan.purpose}</p>
        <p className="text-2xl font-semibold w-2/5 text-left mr-2">{`Amount: ₱ ${new Intl.NumberFormat().format(
          loan.amount
        )}`}</p>
      </div>
    </div>
  );
}
