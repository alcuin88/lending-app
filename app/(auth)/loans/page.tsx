import { verifySession } from "@/actions/dal";
import LoanTable from "@/components/shared/loans";
import { getLoanList } from "@/lib/service";
import { redirect } from "next/navigation";

export default async function LoanList() {
  const session = await verifySession();

  if (session.session === null) {
    return redirect("/");
  }

  const loans = await getLoanList();
  return <LoanTable loans={loans} />;
}
