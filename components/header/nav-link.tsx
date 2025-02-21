"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface props {
  href: string;
  children: React.ReactNode;
  setIsOpenAction: (isOpen: boolean) => void;
}

export default function NavLink({ href, children, setIsOpenAction }: props) {
  const path = usePathname();

  function onClick() {
    setIsOpenAction(false);
  }

  return (
    <Link
      onClick={onClick}
      href={href}
      className={`block py-2 px-4 rounded-md hover:bg-[#f1f5f9] ${
        path.startsWith(href) ?? "no-underline bg-[#f1f5f9]/[80%]"
      }`}
    >
      {children}
    </Link>
  );
}
