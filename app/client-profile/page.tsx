import { getClientIdFromSearch, GetClients } from "@/actions/actions";
import ClientDetailCard from "@/components/client-profile/client-detail-card";
import LoanList from "@/components/client-profile/loan-list";
import PaymentList from "@/components/client-profile/payment-list";
import SearchClient from "@/components/search-client";
import { client } from "@/types/types";

export default async function ClientList() {
  const clients = (await GetClients()) as client[];
  const clientId = await getClientIdFromSearch();

  return (
    <div className="items-start justify-center bg-white min-h-screen p-4">
      <SearchClient clients={clients} />
      <ClientDetailCard />
      <div className="flex w-full bg-gray-50 p-4 rounded-lg shadow-lg mt-4">
        <div className="w-6/12 p-2 justify-items-center">
          <p className="text-2xl">Loans</p>
          <LoanList client_id={clientId} />
        </div>
        <div className="w-6/12 p-2 justify-items-center">
          <p className="text-2xl">Payments</p>
          <PaymentList client_id={clientId} />
        </div>
      </div>
    </div>
  );
}
