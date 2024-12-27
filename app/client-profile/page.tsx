import { getClientIdFromSearch, GetClients } from "@/actions/actions";
import ClientDetailCard from "@/components/client-profile/client-detail-card";
import LoanCard from "@/components/client-profile/loan-card";
import SearchClient from "@/components/search-client";
import { getActiveLoansFromClient } from "@/lib/loans";
import { client, loan } from "@/types/types";

export default async function ClientList() {
  const clients = (await GetClients()) as client[];
  const clientId = await getClientIdFromSearch();
  const currentLoans = (await getActiveLoansFromClient(clientId)) as loan[];
  // const currentPayments = (await getPaymentsFromClient(clientId)) as payment[];

  const clientCard = () => {
    const client = clients.find((client) => client.client_id === clientId);
    const totalActiveLoans = currentLoans.length;
    let totalAmount = 0;

    currentLoans.forEach((value) => (totalAmount += value.amount));
    if (!client) {
      return null;
    } else {
      return (
        <ClientDetailCard
          client={client}
          totalActiveLoans={totalActiveLoans}
          totalAmount={totalAmount}
        />
      );
    }
  };

  const loanList = () => {
    if (!currentLoans || currentLoans.length === 0) {
      return <p>No active loans.</p>;
    }

    return currentLoans.map((loan) => {
      return <LoanCard loan={loan} key={loan.loan_id} />;
    });
  };

  // const paymentList = () => {
  //   if (!currentPayments || currentPayments.length === 0) {
  //     return <p>No Payments.</p>;
  //   }

  //   return currentPayments.map((payment) => (
  //     <PaymentCard payment={payment} key={payment.payment_id} />
  //   ));
  // };

  return (
    <div className="items-start justify-center bg-white min-h-screen p-4">
      <SearchClient clients={clients} />
      {clientCard()}
      <div className="flex w-full">
        <div className="w-full justify-items-center">
          <p className="text-2xl">Active</p>
          {loanList()}
        </div>
      </div>
    </div>
  );
}
