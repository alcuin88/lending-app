import { fetchClients } from "@/actions/loan-creation.form.actions";
import { verifySession } from "@/actions/dal";
import LoanTable from "@/components/shared/loans";
import { Client, Loan, LoanList } from "@/lib/interface";

export default async function Loans() {
  const { token } = await verifySession();
  const data: Client[] = await fetchClients(token);

  if (data.length === 0) {
    return (
      <div className="flex flex-wrap items-start justify-center bg-gray-100 gap-3 p-4">
        <p>No records found!</p>
      </div>
    );
  }

  const loanList = processLoanData(data);

  return <LoanTable loans={loanList} />;
}

function processLoanData(clients: Client[]): LoanList[] {
  return clients.map((client) => {
    const { totalLoans, totalPayments } = client.loans.reduce(
      (acc, loan: Loan) => {
        if (loan.status === "Active" || loan.status === "Paid") {
          acc.totalPayments += loan.amount - loan.balance;
          acc.totalLoans += loan.amount;
        }
        return acc;
      },
      { totalLoans: 0, totalPayments: 0 }
    );

    return {
      client_id: client.client_id,
      last_name: client.last_name,
      first_name: client.first_name,
      totalLoans,
      totalPayments,
    };
  });
}
