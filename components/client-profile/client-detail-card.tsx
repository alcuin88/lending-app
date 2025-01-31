import { Client } from "@/lib/interface";

interface props {
  client: Client;
  totalActiveLoans: number;
  totalAmount: number;
}

export default function ClientDetailCard({
  client,
  totalActiveLoans,
  totalAmount,
}: props) {
  return (
    <div className="flex flex-col bg-white p-6 w-full max-w-2xl mt-4 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">{`${client.last_name}, ${client.first_name}`}</h2>
          <p className="text-sm text-gray-500">{`Client ID: ${client.client_id
            .toString()
            .padStart(5, "0")}`}</p>
        </div>
        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
          Active
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2">{`Active Loans: ${totalActiveLoans}`}</p>
      <div className="flex items-center justify-between bg-blue-100 text-blue-800 p-4 rounded-lg mt-6">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold">Total Balance:</span>
          <span className="text-2xl font-extrabold">
            ₱ {new Intl.NumberFormat().format(totalAmount)}
          </span>
        </div>
        <span className="text-xl">💰</span>
      </div>
    </div>
  );
}
