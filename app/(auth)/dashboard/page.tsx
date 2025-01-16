import { verifySession } from "@/actions/dal";
import LoanTable from "@/components/shared/loans";
import { prisma } from "@/lib/prisma";
import { findRecords, getLoanList } from "@/lib/service";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await verifySession();

  if (session.session === null) {
    return redirect("/");
  }

  let activeLoans = 0;
  let outstandingAmount = 0;
  const userId = session.user.user_id;
  const loans = await findRecords(prisma.loan, { user_id: userId });
  const loanList = await getLoanList(userId);

  loans.forEach((element) => {
    if (element.status == 1) {
      activeLoans++;
      outstandingAmount += element.balance;
    }
  });

  return (
    <>
      <div className="flex flex-wrap items-start justify-center bg-gray-100 gap-3 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md ">
          <h1>Total Active Loans</h1>
          <p className="text-5xl">{activeLoans.toString()}</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md ">
          <h1>Total Outstanding Amount</h1>
          <p className="text-5xl">{`₱ ${new Intl.NumberFormat().format(
            outstandingAmount
          )}`}</p>
        </div>
      </div>
      <div className="box-content h-96 w-full overflow-y-auto overflow-x-hidden p-4">
        <LoanTable loans={loanList} />
      </div>
    </>
  );
}
