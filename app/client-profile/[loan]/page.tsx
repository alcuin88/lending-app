import BackToClientProfile from "@/components/client-profile/back-link";
import LoanDetailCard from "@/components/client-profile/loan-detail-card";
import PaymentForm from "@/components/client-profile/payment-form";
import { notFound } from "next/navigation";

export default async function LoanDetailPage({
  params,
}: {
  params: Promise<{ loan: number }>;
}) {
  const id = (await params).loan;

  if (!id) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-white to-gray-50 p-6 w-full mt-4 rounded-lg shadow-lg border border-gray-200">
      <div className="w-full">
        <BackToClientProfile />
        <div className="flex gap-2">
          <LoanDetailCard loan_id={id} />
          <PaymentForm />
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
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="py-2 px-4 border border-gray-200 text-center">
                  1
                </td>
                <td className="py-2 px-4 border border-gray-200">12/27/2024</td>
                <td className="py-2 px-4 border border-gray-200 ">₱ 5000</td>
                <td className="py-2 px-4 border border-gray-200">
                  Initial payment
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
