"use client";

import Link from "next/link";
import NavLink from "./nav-link";
import Image from "next/image";
import logo from "@/public/images/money-icon.png";
import logout_img from "@/public/images/logout.png";
import { logout } from "@/actions/auth-actions";
import { useState } from "react";

export default function MainHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="flex justify-between items-center p-4 w-full rounded-lg border-none border-gray-200 shadow-md bg-white relative">
      {/* Logo */}
      <div className="text-2xl md:text-3xl flex items-center gap-2">
        <Link href="/dashboard" className="flex items-center gap-2">
          <h1 className="font-bold">LendingApp</h1>
          <Image src={logo} alt="Money Icon" width={40} height={40} />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden focus:outline-none"
      >
        <svg
          className="w-8 h-8 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
      </button>

      {/* Navigation Menu */}
      <nav
        className={`${
          isOpen ? "flex" : "hidden"
        } md:flex flex-col md:flex-row gap-4 md:gap-8 text-lg p-4 md:p-0 absolute md:relative top-full md:top-auto left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none`}
      >
        <ul className="flex flex-col md:flex-row gap-4 md:gap-8 text-lg">
          <li>
            <NavLink href="/dashboard" setIsOpenAction={setIsOpen}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink href="/loans" setIsOpenAction={setIsOpen}>
              Loans
            </NavLink>
          </li>
          <li>
            <NavLink href="/client-profile" setIsOpenAction={setIsOpen}>
              Client Profile
            </NavLink>
          </li>
          <li>
            <NavLink href="/loan-creation" setIsOpenAction={setIsOpen}>
              New Loan
            </NavLink>
          </li>
          <li>
            <form action={logout}>
              <button className="p-2 rounded hover:bg-gray-200">
                <Image src={logout_img} alt="Logout" width={25} height={25} />
              </button>
            </form>
          </li>
        </ul>
      </nav>
    </header>
  );
}
