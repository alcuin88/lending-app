import { fetchClients } from "@/actions/loan-creation.form.actions";
import { verifySession } from "@/actions/dal";

import LoanTable from "@/components/shared/loans";
import { Client, Loan, LoanList } from "@/lib/interface";

export default async function Dashboard() {
  const { token, email } = await verifySession();
  const user_email = email.split("@")[0];
  const data: Client[] = await fetchClients(token);

  let activeLoans = 0;
  let outstandingAmount = 0;
  const loanList: LoanList[] = [];

  if (data.length === 0) {
    return (
      <div className="flex flex-wrap items-start justify-center bg-gray-100 gap-3 p-4">
        <p>No records found!</p>
      </div>
    );
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
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
        Welcome, {user_email}!
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h1 className="text-lg font-semibold text-gray-700">
            Total Active Loans
          </h1>
          <p className="text-3xl font-bold">{activeLoans.toString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h1 className="text-lg font-semibold text-gray-700">
            Total Outstanding Amount
          </h1>
          <p className="text-3xl font-bold">{`₱ ${new Intl.NumberFormat().format(
            outstandingAmount
          )}`}</p>
        </div>
      </div>
      <div className="box-content w-full h-[32rem] sm:h-96 overflow-y-auto p-4 bg-white shadow-lg rounded-lg">
        <LoanTable loans={loanList} />
      </div>
    </>
  );
}
