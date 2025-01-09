import LoanTable from "@/components/shared/loans";
import { getLoanList } from "@/lib/service";

export default async function LoanList() {
  const loans = await getLoanList();
  return <LoanTable loans={loans} />;
}
