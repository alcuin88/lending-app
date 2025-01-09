interface props {
  data: {
    client_id: number;
    last_name: string;
    first_name: string;
    totalLoans: number;
    totalPayments: number;
  };
  index: number;
}

export default function LoanRow({ data, index }: props) {
  return (
    <tr>
      <td className="w-1 border border-gray-300 px-4 py-2 text-left font-medium text-gray-700 justify-items-center">
        {index}
      </td>
      <td className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
        {`${data.last_name}, ${data.first_name}`}
      </td>
      <td className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
        {`₱${data.totalLoans}`}
      </td>
      <td className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
        {`₱${data.totalPayments}`}
      </td>
      <td className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
        {`₱${data.totalLoans - data.totalPayments}`}
      </td>
    </tr>
  );
}
