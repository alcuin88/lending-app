import DashboardCard from "@/components/dashboard-card";
import LoanTable from "@/components/shared/loans";
import { getLoanList, getLoans } from "@/lib/service";

export default async function Home() {
  let activeLoans = 0;
  let outstandingAmount = 0;

  const loans = await getLoans();
  const loanList = await getLoanList();

  loans.forEach((element) => {
    if (element.status == 1) {
      activeLoans++;
      outstandingAmount += element.balance;
    }
  });

  return (
    <>
      <div className="flex flex-wrap items-start justify-center bg-gray-100 gap-3 p-4">
        <DashboardCard
          title="Total Active Loans"
          value={activeLoans.toString()}
        />
        <DashboardCard
          title="Total Outstanding Amount"
          value={`₱ ${new Intl.NumberFormat().format(outstandingAmount)}`}
        />
      </div>
      <div className="box-content h-96 w-full overflow-y-auto overflow-x-hidden p-4">
        <LoanTable loans={loanList} />
      </div>
    </>
  );
}
