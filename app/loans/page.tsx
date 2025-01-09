import LoanRow from "@/components/loans/loan-row";
import { getLoanList } from "@/lib/service";

export default async function LoanList() {
  const loans = await getLoanList();
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="w-1 border border-gray-300 px-4 py-2 text-left font-medium text-gray-700 justify-items-center">
              #
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
              Name
            </th>
            <th className="w-60 border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
              Total Loan Amount
            </th>
            <th className="w-60 border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
              Payments
            </th>
            <th className="w-60 border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
              Outstanding Balance
            </th>
          </tr>
        </thead>
        <tbody>
          {loans.map((item, index) => {
            return (
              <LoanRow data={item} index={index + 1} key={item.client_id} />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
