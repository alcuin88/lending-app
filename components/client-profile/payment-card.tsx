interface props {
  amount: number;
  date: string;
}

export default function PaymentCard({ amount, date }: props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md mt-2">
      <div className="justify-items-end">
        <p className="text-xs">{date}</p>
      </div>
      <div className="flex items-center justify-center">
        <p className="text-2xl">{`₱ ${new Intl.NumberFormat().format(
          amount
        )}`}</p>
        <div className="bg-gray-100"></div>
      </div>
    </div>
  );
}
