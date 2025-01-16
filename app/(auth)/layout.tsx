import type { Metadata } from "next";
import "../globals.css";
import MainHeader from "@/components/header/main-header";

export const metadata: Metadata = {
  title: "Money Lending App",
  description: "A web app for tracking loans.",
};

export default function AuthRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MainHeader />
      <main className="font-sans font-normal">{children}</main>
    </>
  );
}
