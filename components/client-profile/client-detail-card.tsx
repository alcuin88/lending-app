import { client } from "@/types/types";

interface props {
  client: client;
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
      <p className="text-sm text-gray-500">{`ID: ${client.client_id
        .toString()
        .padStart(5, "0")}`}</p>
      <p className="text-lg font-semibold text-gray-800 mt-1">
        {`${client.last_name}, ${client.first_name} ${client.middle_name}`}
      </p>
      <p className="text-sm text-gray-600 mt-2">{`Active Loans: ${totalActiveLoans}`}</p>
      <p className="text-xl font-bold text-gray-900 mt-1">{`₱ ${new Intl.NumberFormat().format(
        totalAmount
      )}`}</p>
    </div>
  );
}
