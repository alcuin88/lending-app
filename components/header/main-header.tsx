import Link from "next/link";
import NavLink from "./nav-link";
import Image from "next/image";
import logo from "@/assests/images/money-icon.png";

export default function MainHeader() {
  return (
    <header className="flex justify-between items-center mb-8 font-bold">
      <div className="text-3xl">
        <Link className="flex items-center gap-2" href="/dashboard">
          <h1>LoanApp</h1>
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
        </ul>
      </nav>
    </header>
  );
}
