"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface props {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: props) {
  const path = usePathname();

  return (
    <Link
      href={href}
      className={
        path.startsWith(href)
          ? "no-underline bg-[#f1f5f9] py-2 px-4 rounded hover:bg-[#f1f5f9]"
          : "py-2 px-4 rounded hover:bg-[#f1f5f9]"
      }
    >
      {children}
    </Link>
  );
}
