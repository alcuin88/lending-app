import ModalBackdrop from "@/components/client-profile/modal-backdrop";

export default async function LoanDetailPage({
  params,
}: {
  params: Promise<{ loan_id: number }>;
}) {
  return (
    <>
      <ModalBackdrop />
      <dialog
        className="px-8 rounded border-none shadow-sm max-w-3xl w-full bg-white"
        open
      >
        <div className="w-full">
          {(await params).loan_id}
          <h1>payments</h1>
          <div>
            <table className="table-auto">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Outstanding Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>12/27/2024</td>
                  <td>5000</td>
                  <td>2000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </dialog>
    </>
  );
}
