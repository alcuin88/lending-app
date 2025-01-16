import Link from "next/link";
import NavLink from "./nav-link";
import Image from "next/image";
import logo from "@/assets/images/money-icon.png";
import logout_img from "@/assets/images/logout.png";
import { logout } from "@/actions/auth-actions";

export default function MainHeader() {
  return (
    <header className="flex justify-between items-center mb-8 font-bold p-2 w-full rounded-lg border-none border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="text-3xl">
        <Link className="flex items-center gap-2" href="/dashboard">
          <h1>LendingApp</h1>
          <Image src={logo.src} alt="Money Icon" width={50} height={50} />
        </Link>
      </div>
      <nav>
        <ul className="flex gap-8 text-xl">
          <li>
            <NavLink href="/dashboard">Dashboard</NavLink>
          </li>
          <li>
            <NavLink href="/loans">Loans</NavLink>
          </li>
          <li>
            <NavLink href="/client-profile">Client Profile</NavLink>
          </li>
          <li>
            <NavLink href="/loan-creation">New Loan</NavLink>
          </li>
          <li>
            <form action={logout}>
              <button className="py-2 px-4 rounded hover:bg-[#f1f5f9]">
                <Image src={logout_img} alt={"logout"} width={25} height={25} />
              </button>
            </form>
          </li>
        </ul>
      </nav>
    </header>
  );
}
