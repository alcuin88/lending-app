import {
  fetchClients,
  getClientIdFromSearch,
} from "@/actions/loan-creation.form.actions";
import { verifySession } from "@/actions/dal";
import ClientDetailCard from "@/components/client-profile/client-detail-card";
import FormToggle from "@/components/client-profile/form-toggle";
import LoanCard from "@/components/client-profile/loan-card";
import PaymentCard from "@/components/client-profile/payment-card";
import SearchClient from "@/components/search-client";
import { Loan, Payment } from "@/lib/interface";

export default async function ClientList() {
  const { token } = await verifySession();
  const clients = await fetchClients(token);
  const clientId = await getClientIdFromSearch();

  if (!clients.length) {
    return (
      <div className="items-start justify-center bg-white min-h-screen p-4">
        <p>No Clients for this user.</p>
      </div>
    );
  }

  const client = clients.find((client) => client.client_id === clientId);

  if (!client) {
    return (
      <div className="items-start justify-center bg-white min-h-screen p-4">
        <p>Client not found.</p>
      </div>
    );
  }

  const currentLoans = filterActiveLoans(client.loans);
  const clientPayments = filterActivePayments(client.payments);

  const totalActiveLoans = currentLoans.length;
  const totalAmount = currentLoans.reduce(
    (total, loan) => total + loan.balance,
    0
  );
  const hasActiveLoans = totalActiveLoans > 0;

  return (
    <div className="bg-white min-h-screen p-4">
      <SearchClient clients={clients} />
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <ClientDetailCard
          client={client}
          totalActiveLoans={totalActiveLoans}
          totalAmount={totalAmount}
        />
        <FormToggle status={hasActiveLoans} clientId={clientId} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4 md:gap-8 mt-6 max-w-screen-lg mx-auto">
        <LoanSection loans={currentLoans} />
        <PaymentSection payments={clientPayments} />
      </div>
    </div>
  );
}

function filterActiveLoans(loans: Loan[]) {
  return loans.filter((loan) => loan.status === "Active").sort(sortByStatus);
}

function filterActivePayments(payments: Payment[]) {
  return payments
    .filter((payment) => payment.status === "Active")
    .sort(sortByStatus);
}

function sortByStatus(a: { status: string }, b: { status: string }) {
  return a.status.localeCompare(b.status);
}

function LoanSection({ loans }: { loans: Loan[] }) {
  return (
    <div className="w-full">
      <p className="text-2xl font-semibold mb-2 text-gray-800">Loans</p>
      <div className="box-content h-96 w-full overflow-y-auto p-4 bg-gray-50 shadow-md rounded-lg">
        {loans.length ? (
          loans.map((loan) => <LoanCard key={loan.loan_id} loan={loan} />)
        ) : (
          <p>No active loans.</p>
        )}
      </div>
    </div>
  );
}

function PaymentSection({ payments }: { payments: Payment[] }) {
  return (
    <div className="w-full">
      <p className="text-2xl font-semibold mb-2 text-gray-800">Payments</p>
      <div className="box-content h-96 w-full overflow-y-auto p-4 bg-gray-50 shadow-md rounded-lg">
        {payments.length ? (
          payments.map((payment) => (
            <PaymentCard key={payment.payment_id} payment={payment} />
          ))
        ) : (
          <p>No payments yet.</p>
        )}
      </div>
    </div>
  );
}
