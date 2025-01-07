import { getClient } from "@/actions/actions";
import BackToClientProfile from "@/components/client-profile/back-link";
import LoanDetailCard from "@/components/client-profile/loan-detail-card";
import MyForm from "@/components/client-profile/my-form";
import { SubmitType } from "@/lib/constants";
import { getPaymentsForLoan } from "@/lib/loans";
import { notFound } from "next/navigation";

export default async function LoanDetailPage({
  params,
}: {
  params: Promise<{
    slug: number[];
  }>;
}) {
  const data = (await params).slug;

  if (data.length === 0) {
    notFound();
  }

  const loan_id = data[0];
  const client_id = data[1];
  const payments = await getPaymentsForLoan(loan_id);
  const client = await getClient(client_id);

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

    return payments.map((payment, index) => {
      return (
        <tr key={payment.payment_id} className="hover:bg-gray-50">
          <td className="py-2 px-4 border border-gray-200 text-center">
            {++index}
          </td>
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
          <LoanDetailCard
            loan_id={loan_id}
            client={client}
            payments={payments}
          />
          <MyForm
            client_id={client_id}
            loan_id={loan_id}
            type={SubmitType.payment}
          />
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