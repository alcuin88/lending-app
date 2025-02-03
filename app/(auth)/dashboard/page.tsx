import { fetchClients } from "@/actions/loan-creation.form.actions";
import { verifySession } from "@/actions/dal";

import LoanTable from "@/components/shared/loans";
import { Client, Loan, LoanList } from "@/lib/interface";
import { notFound } from "next/navigation";

export default async function Dashboard() {
  const token = await verifySession();

  const data: Client[] = await fetchClients(token);
  let activeLoans = 0;
  let outstandingAmount = 0;
  const loanList: LoanList[] = [];

  if (data.length === 0) {
    return notFound();
  }

  data.forEach((client: Client) => {
    let totalPayments = 0;
    let totalLoans = 0;
    client.loans.forEach((loan: Loan) => {
      if (loan.status) {
        totalPayments += loan.amount - loan.balance;
        totalLoans += loan.amount;
        activeLoans++;
        outstandingAmount += loan.balance;
      }
    });
    loanList.push({
      client_id: client.client_id,
      last_name: client.last_name,
      first_name: client.first_name,
      totalLoans,
      totalPayments,
    });
  });

  return (
    <>
      <div className="flex flex-wrap items-start justify-center bg-gray-100 gap-3 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md ">
          <h1>Total Active Loans</h1>
          <p className="text-5xl">{activeLoans.toString()}</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md ">
          <h1>Total Outstanding Amount</h1>
          <p className="text-5xl">{`₱ ${new Intl.NumberFormat().format(
            outstandingAmount
          )}`}</p>
        </div>
      </div>
      <div className="box-content h-96 w-full overflow-y-auto overflow-x-hidden p-4">
        <LoanTable loans={loanList} />
      </div>
    </>
  );
}
