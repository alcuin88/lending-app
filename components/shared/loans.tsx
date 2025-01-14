import { loan_list } from "@/types/types";

export default function LoanTable({ loans }: { loans: loan_list[] }) {
  return (
    <div className="w-full mt-4">
      <div className="bg-gray-200 text-gray-700 font-medium grid grid-cols-5 border border-gray-300 rounded-t-md px-4 py-2">
        <div className="w-1">#</div>
        <div>Name</div>
        <div>Total Loan Amount</div>
        <div>Payments</div>
        <div>Outstanding Balance</div>
      </div>
      <div className="border border-gray-300 rounded-b-md divide-y divide-gray-300">
        {loans.map((item, index) => (
          <div
            key={item.client_id}
            className={`grid grid-cols-5 px-4 py-2 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            }`}
          >
            <div className="text-gray-600 w-1">{index + 1}</div>
            <div className="text-gray-700">{`${item}, ${item.first_name}`}</div>
            <div className="text-gray-600">{item.totalLoans}</div>
            <div className="text-gray-600">{item.totalPayments}</div>
            <div className="text-gray-600">
              {item.totalLoans - item.totalPayments}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
