import DashboardCard from "@/components/dashboard-card";
import { getLoans } from "@/lib/loans";
import { loan } from "@/types/types";

export default async function Home() {
  let activeLoans = 0;
  let outstandingAmount = 0;
  let repaidAmount = 0;

  const loans = (await getLoans()) as loan[];

  loans.forEach((element) => {
    if (element.status == 1) {
      activeLoans++;
      outstandingAmount += element.amount;
    } else {
      repaidAmount += element.amount;
    }
  });

  return (
    <div className="flex flex-wrap items-start justify-center bg-gray-100 gap-3 p-4">
      <DashboardCard
        title="Total Active Loans"
        value={activeLoans.toString()}
      />
      <DashboardCard
        title="Total Outstanding Amount"
        value={`₱ ${new Intl.NumberFormat().format(outstandingAmount)}`}
      />
      <DashboardCard
        title="Total Repaid Amount"
        value={`₱ ${new Intl.NumberFormat().format(repaidAmount)}`}
      />
      <DashboardCard
        title="Remaining Balance"
        value={`₱ ${new Intl.NumberFormat().format(
          outstandingAmount - repaidAmount
        )}`}
      />
    </div>
  );
}
