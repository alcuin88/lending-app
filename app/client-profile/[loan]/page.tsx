import BackToClientProfile from "@/components/client-profile/back-link";
import LoanDetailCard from "@/components/client-profile/loan-detail-card";
import MyForm from "@/components/client-profile/my-form";
import { SubmitType } from "@/lib/constants";
import { getPaymentsFromClient } from "@/lib/loans";
import { notFound } from "next/navigation";

export default async function LoanDetailPage({
  params,
}: {
  params: Promise<{ loan: number }>;
}) {
  const id = (await params).loan;
  const payments = await getPaymentsFromClient(id);

  if (!id) {
    notFound();
  }

  function paymentsTableRow() {
    if (payments.length === 0) {
      return (
        <tr className="hover:bg-gray-50">
          <td colSpan={4} className="text-center">
            <p>No payments yet.</p>
          </td>
        </tr>
      );
    }

    return payments.map((payment) => {
      return (
        <tr key={payment.payment_id} className="hover:bg-gray-50">
          <td className="py-2 px-4 border border-gray-200 text-center">1</td>
          <td className="py-2 px-4 border border-gray-200">
            {payment.created_at}
          </td>
          <td className="py-2 px-4 border border-gray-200 ">
            ₱ {new Intl.NumberFormat().format(payment.amount)}
          </td>
          <td className="py-2 px-4 border border-gray-200">
            {payment.remarks}
          </td>
        </tr>
      );
    });
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-white to-gray-50 p-6 w-full mt-4 rounded-lg shadow-lg border border-gray-200">
      <div className="w-full">
        <BackToClientProfile />
        <div className="flex gap-2">
          <LoanDetailCard loan_id={id} payments={payments} />
          <MyForm type={SubmitType.payment} />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-4">
            Payments
          </h3>
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border border-gray-200 text-left">
                  #
                </th>
                <th className="py-2 px-4 border border-gray-200 text-left">
                  Date
                </th>
                <th className="py-2 px-4 border border-gray-200 text-left">
                  Amount
                </th>
                <th className="py-2 px-4 border border-gray-200 text-left">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody>{paymentsTableRow()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
