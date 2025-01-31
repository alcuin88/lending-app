import { verifySession } from "@/actions/dal";
import LoanCreationForm from "@/components/loan-creation/loan-creation-form";

export default async function LoanCreation() {
  await verifySession();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Loan Creation</h1>
        <LoanCreationForm />
      </div>
    </div>
  );
}
