export default function LoanDetailCard({ loan_id }: { loan_id: number }) {
  return (
    <div className="flex flex-col bg-white p-6 w-full max-w-2xl mt-4 rounded-lg shadow-md border border-gray-200">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">{`Andrade, Alcuin Allan`}</h2>
          <p className="text-sm text-gray-500">{`Loan ID: ${loan_id
            .toString()
            .padStart(5, "0")}`}</p>
        </div>
        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
          Active
        </div>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-800">Loan Amount:</span> ₱{" "}
          {new Intl.NumberFormat().format(1500)}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-800">Total Payments:</span> ₱{" "}
          {new Intl.NumberFormat().format(1000)}
        </p>
      </div>

      {/* Remaining Balance Highlight */}
      <div className="flex items-center justify-between bg-blue-100 text-blue-800 p-4 rounded-lg mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold">Remaining Balance:</span>
          <span className="text-2xl font-extrabold">
            ₱ {new Intl.NumberFormat().format(1000)}
          </span>
        </div>
        <span className="text-xl">💰</span>
      </div>
    </div>
  );
}
