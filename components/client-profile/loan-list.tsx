import { loan } from "@/types/types";
import { getActiveLoansFromClient } from "@/lib/loans";
import ListCard from "./payment-card";
import LoanCard from "./loan-card";

export default async function LoanList({ client_id }: { client_id: number }) {
  const currentLoans = (await getActiveLoansFromClient(client_id)) as loan[];

  if (!currentLoans || currentLoans.length === 0) {
    return <p>No active loans.</p>;
  }

  return currentLoans.map((loan, index) => (
    <LoanCard loan={loan} key={index} />
  ));
}
