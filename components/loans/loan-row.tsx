interface props {
  data: {
    client_id: number;
    first_name: string;
    last_name: string;
    total_loans: number;
    total_payments: number;
  };
  index: number;
}

export default function LoanRow({ data, index }: props) {
  console.log(data);
  return (
    <tr>
      <td className="w-1 border border-gray-300 px-4 py-2 text-left font-medium text-gray-700 justify-items-center">
        {index}
      </td>
      <td className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
        {`${data.last_name}, ${data.first_name}`}
      </td>
      <td className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
        {`₱${data.total_loans}`}
      </td>
      <td className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
        {`₱${data.total_payments}`}
      </td>
      <td className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
        {`₱${data.total_loans - data.total_payments}`}
      </td>
    </tr>
  );
}
