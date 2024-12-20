import { GetClients } from "@/actions/actions";
import { EXISTING_ACCOUNT, NEW_ACCOUNT } from "@/lib/constants";
import { client } from "@/types/types";

interface props {
  loanType: (type: number) => void;
  setClients?: (clients: client[]) => void;
}

export default function LoanTypeHeader({ loanType, setClients }: props) {
  const currentUsers = async () => {
    if (!setClients) {
      return;
    }
    const users = (await GetClients()) as client[];
    if (!users || users.length === 0) {
      setClients([]);
    }
    setClients(users);
  };

  return (
    <div className="flex items-stretch h-min mb-4">
      <div className="w-full justify-items-center">
        <button
          className="w-full"
          onClick={() => {
            loanType(NEW_ACCOUNT);
          }}
        >
          New Account
        </button>
      </div>
      <div className="w-full justify-items-center">
        <button
          className="w-full"
          onClick={() => {
            loanType(EXISTING_ACCOUNT);

            currentUsers();
          }}
        >
          Existing Account
        </button>
      </div>
    </div>
  );
}
