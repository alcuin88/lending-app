import { Loan } from "@prisma/client";
import Link from "next/link";

interface props {
  loan: Loan;
}

export default function LoanCard({ loan }: props) {
  const date = new Date(loan.created_at).toISOString();

  return (
    <div className="flex flex-col bg-sky-50/30 p-4 rounded-sm shadow-md w-full mt-2">
      <Link href={`/client-profile/${loan.loan_id}`}>
        <div className="flex items-start">
          <div className="flex flex-col text-gray-500 text-xs mb-2 text-right ml-auto">
            <p>{`Date: ${date.split("T")[0]}`}</p>
            {!loan.status ? <p>{`Paid: ${loan.closed_at}`}</p> : null}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-700 w-2/5 text-left">
            {loan.purpose}
          </p>
          <p className="text-2xl font-semibold w-2/5 text-left mr-2">{`Balance: ₱ ${new Intl.NumberFormat().format(
            loan.balance
          )}`}</p>
        </div>
      </Link>
    </div>
  );
}
