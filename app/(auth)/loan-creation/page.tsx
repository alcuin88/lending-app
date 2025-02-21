import { verifySession } from "@/actions/dal";
import LoanCreationForm from "@/components/loan-creation/loan-creation-form";

export default async function LoanCreation() {
  const { token } = await verifySession();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full sm:max-w-md md:max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Loan Creation
        </h1>
        <LoanCreationForm token={token} />
      </div>
    </div>
  );
}
