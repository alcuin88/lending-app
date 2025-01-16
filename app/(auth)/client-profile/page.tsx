import { getClientIdFromSearch, GetClients } from "@/actions/actions";
import { verifySession } from "@/actions/dal";
import ClientDetailCard from "@/components/client-profile/client-detail-card";
import FormToggle from "@/components/client-profile/form-toggle";
import LoanCard from "@/components/client-profile/loan-card";
import PaymentCard from "@/components/client-profile/payment-card";
import SearchClient from "@/components/search-client";
import { prisma } from "@/lib/prisma";

import { findRecords } from "@/lib/service";
import { redirect } from "next/navigation";

export default async function ClientList() {
  const session = await verifySession();

  if (session.session === null) {
    return redirect("/");
  }

  const userId = session.user.user_id;
  const clients = await GetClients(userId);
  const clientId = await getClientIdFromSearch();
  const currentLoans = await findRecords(prisma.loan, {
    client_id: clientId,
    user_id: userId,
  });
  const clientPayments = await findRecords(prisma.payment, {
    client_id: +clientId,
  });

  const clientCard = () => {
    const client = clients.find((client) => client.client_id === clientId);
    const totalActiveLoans = currentLoans.length;
    let totalAmount = 0;

    currentLoans.forEach((value) => (totalAmount += value.balance));
    if (!client) {
      return null;
    } else {
      return (
        <>
          <div className="flex gap-2">
            <ClientDetailCard
              client={client}
              totalActiveLoans={totalActiveLoans}
              totalAmount={totalAmount}
            />
            <FormToggle clientId={clientId} userId={userId} />
          </div>
          <div className="grid grid-cols-2 w-full gap-4 mt-4">
            <div className="w-full justify-items-center">
              <p className="text-2xl">Loans</p>
              <div className="box-content h-96 w-full overflow-y-auto overflow-x-hidden p-4">
                {loanList()}
              </div>
            </div>
            <div className="w-full justify-items-center">
              <p className="text-2xl">Payments</p>
              <div className="box-content h-96 w-full overflow-y-auto overflow-x-hidden p-4">
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
    <div className="items-start justify-center bg-white min-h-screen p-4">
      <SearchClient clients={clients} />
      {clientCard()}
    </div>
  );
}
