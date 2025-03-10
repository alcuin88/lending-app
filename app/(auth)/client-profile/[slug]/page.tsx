import { verifySession } from "@/actions/dal";
import BackToClientProfile from "@/components/client-profile/back-link";
import LoanDetailCard from "@/components/client-profile/loan-detail-card";
import MyForm from "@/components/client-profile/my-form";
import { SubmitType } from "@/lib/constants";

import { notFound } from "next/navigation";
import {
  getClientById,
  getLoanById,
  getLoanPayments,
} from "@/actions/client-loan-payment.actions";

export default async function LoanDetailPage({
  params,
}: {
  params: Promise<{
    slug: number;
  }>;
}) {
  const { token } = await verifySession();

  const loan_id = (await params).slug;

  if (!loan_id) {
    notFound();
  }

  const payments = await getLoanPayments(loan_id, token);
  const loan = await getLoanById(loan_id, token);

  if (!loan || loan === null) {
    notFound();
  }
  const client = await getClientById(loan.client_id, token);

  if (!client || client === null) {
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

    return payments.map((payment, index) => {
      const date = new Date(payment.created_at).toISOString();
      return (
        <tr key={payment.payment_id} className="hover:bg-gray-50">
          <td className="py-2 px-4 border border-gray-200 text-center">
            {++index}
          </td>
          <td className="py-2 px-4 border border-gray-200">
            {date.split("T")[0]}
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
          <LoanDetailCard loan={loan} client={client} payments={payments} />
          <div className="flex flex-col bg-white p-6 w-full max-w-2xl mt-4 rounded-lg shadow-md border border-gray-200">
            <MyForm
              status={loan.status === "Active" ? true : false}
              client_id={loan.client_id}
              loan_id={loan_id}
              type={SubmitType.payment}
            />
          </div>
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
