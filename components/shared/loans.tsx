import { LoanList } from "@/lib/interface";
import Link from "next/link";

export default function LoanTable({ loans }: { loans: LoanList[] }) {
  return (
    <div className="w-full mt-4">
      {/* Table Header */}
      <div className="hidden md:grid bg-gray-200 text-gray-700 font-medium grid-cols-5 border border-gray-300 rounded-t-md px-4 py-2">
        <div className="w-1">#</div>
        <div>Name</div>
        <div>Total Loan Amount</div>
        <div>Payments</div>
        <div>Outstanding Balance</div>
      </div>

      {/* Table Body */}
      <div className="border border-gray-300 rounded-b-md divide-y divide-gray-300">
        {loans.map((item, index) => (
          <Link key={item.client_id} href={"/client-profile"}>
            <div
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } grid md:grid-cols-5 px-4 py-2 flex flex-col md:flex-row gap-2 md:gap-0 hover:bg-gray-100`}
            >
              {/* Mobile Numbering */}
              <div className="md:w-1 md:text-center font-bold text-gray-600">
                {index + 1}
              </div>

              {/* Name */}
              <div className="text-gray-700">
                <span className="md:hidden font-medium">Name: </span>
                {`${item.last_name}, ${item.first_name}`}
              </div>

              {/* Total Loan Amount */}
              <div className="text-gray-600">
                <span className="md:hidden font-medium">Total Loan: </span>
                {item.totalLoans}
              </div>

              {/* Payments */}
              <div className="text-gray-600">
                <span className="md:hidden font-medium">Payments: </span>
                {item.totalPayments}
              </div>

              {/* Outstanding Balance */}
              <div className="text-gray-600">
                <span className="md:hidden font-medium">Balance: </span>
                {item.totalLoans - item.totalPayments}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
