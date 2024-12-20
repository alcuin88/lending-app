import { payment } from "@/types/types";
import { getPayments } from "@/lib/loans";
import PaymentCard from "./payment-card";

export default async function PaymentList({
  client_id,
}: {
  client_id: number;
}) {
  const payments: payment[] = [];
  const currentpayments = await getPayments();
  currentpayments.forEach(async (payment: payment) => {
    if (payment.client_id === client_id) {
      payments.push(payment);
    }
  });

  if (!payments || payments.length === 0) {
    return <p>No Payments.</p>;
  }

  return payments.map((payment, index) => (
    <PaymentCard
      amount={payment.amount}
      date={payment.created_at}
      key={index}
    />
  ));
}
