import { payment } from "@/types/types";

interface props {
  payment: payment;
}

export default function PaymentCard({ payment }: props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md mt-2">
      <div className="justify-items-end">
        <p className="text-xs">{payment.created_at}</p>
      </div>
      <div className="flex items-center justify-center">
        <p>{payment.loan_id}</p>
        <p className="text-2xl">{`₱ ${new Intl.NumberFormat().format(
          payment.amount
        )}`}</p>
        <div className="bg-gray-100"></div>
      </div>
    </div>
  );
}
