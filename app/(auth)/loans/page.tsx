import { fetchClients } from "@/actions/loan-creation.form.actions";
import { verifySession } from "@/actions/dal";
import LoanTable from "@/components/shared/loans";
import { Client, Loan, LoanList } from "@/lib/interface";

export default async function Loans() {
  const token = await verifySession();
  const data = await fetchClients(token);

  if (data.length === 0) {
    return (
      <div className="flex flex-wrap items-start justify-center bg-gray-100 gap-3 p-4">
        <p>No records found!</p>
      </div>
    );
  }

  const loanList: LoanList[] = [];
  data.forEach((client: Client) => {
    let totalPayments = 0;
    let totalLoans = 0;
    client.loans.forEach((loan: Loan) => {
      if (loan.status) {
        totalPayments += loan.amount - loan.balance;
        totalLoans += loan.amount;
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

  return <LoanTable loans={loanList} />;
}
