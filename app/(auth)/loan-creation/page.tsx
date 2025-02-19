import { verifySession } from "@/actions/dal";
import LoanCreationForm from "@/components/loan-creation/loan-creation-form";

export default async function LoanCreation() {
  const token = await verifySession();

  return (
    <div className="flex flex-wrap items-start justify-center bg-gray-100 gap-3 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Loan Creation</h1>
        <LoanCreationForm token={token} />
      </div>
    </div>
  );
}
