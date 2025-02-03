import { Payment } from "@/lib/interface";

interface props {
  payment: Payment;
}

export default function PaymentCard({ payment }: props) {
  const date = payment.created_at.toString();

  return (
    <div className="flex flex-col bg-sky-50/30 p-4 rounded-sm shadow-md w-full mt-2">
      <div className="flex items-start">
        <div className="flex flex-col text-gray-500 text-xs mb-2 text-right ml-auto">
          <p>{`Date: ${date.split("T")[0]}`}</p>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-sm text-gray-700 w-2/5 text-left">
          {payment.remarks}
        </p>
        <p className="text-2xl font-semibold w-2/5 text-left mr-2">{`Balance: ₱ ${new Intl.NumberFormat().format(
          payment.amount
        )}`}</p>
      </div>
    </div>
  );
}
