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
  const currentLoans: Loan[] = [];
  const clientPayments: Payment[] = [];

  const clientCard = () => {
    if (clients.length === 0) {
      return (
        <div className="items-start justify-center bg-white min-h-screen p-4">
          <p>No Clients for this user.</p>
        </div>
      );
    }
    const client = clients.find((client) => client.client_id === clientId);

    clients.forEach((client) => {
      if (client.client_id === clientId) {
        client.loans.forEach((loan) => {
          if (loan.status === "Active") {
            currentLoans.push(loan);
          }
        });
      }
    });

    clients.forEach((client) => {
      if (client.client_id === clientId) {
        client.payments.forEach((payment) => {
          clientPayments.push(payment);
        });
      }
    });

    if (!client) {
      return null;
    } else {
      const totalActiveLoans = currentLoans.length;
      const status = totalActiveLoans > 0 ? true : false;
      const totalAmount = currentLoans.reduce(
        (total, loan) => total + loan.balance,
        0
      );
      return (
        <>
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <ClientDetailCard
              client={client}
              totalActiveLoans={totalActiveLoans}
              totalAmount={totalAmount}
            />
            <FormToggle status={status} clientId={clientId} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4 md:gap-8 mt-6 max-w-screen-lg mx-auto">
            <div className="w-full">
              <p className="text-2xl font-semibold mb-2 text-gray-800">Loans</p>
              <div className="box-content h-96 w-full overflow-y-auto p-4 bg-gray-50 shadow-md rounded-lg">
                {loanList()}
              </div>
            </div>
            <div className="w-full">
              <p className="text-2xl font-semibold mb-2 text-gray-800">
                Payments
              </p>
              <div className="box-content h-96 w-full overflow-y-auto p-4 bg-gray-50 shadow-md rounded-lg">
                {paymentList()}
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  const loanList = () => {
    if (!currentLoans || currentLoans.length === 0) {
      return <p>No active loans.</p>;
    }
    currentLoans.sort((a, b) => {
      if (a.status < b.status) {
        return -1;
      }
      if (a.status > b.status) {
        return 1;
      }

      return 0;
    });
    return currentLoans.map((loan) => {
      return <LoanCard loan={loan} key={loan.loan_id} />;
    });
  };

  const paymentList = () => {
    if (!clientPayments || clientPayments.length === 0) {
      return <p>No payments yes.</p>;
    }
    return clientPayments.map((payment) => {
      return <PaymentCard payment={payment} key={payment.payment_id} />;
    });
  };

  return (
    <div className="bg-white min-h-screen p-4">
      <SearchClient clients={clients} />
      {clientCard()}
    </div>
  );
}
