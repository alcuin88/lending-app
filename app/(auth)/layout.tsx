import type { Metadata } from "next";
import "../globals.css";
import MainHeader from "@/components/header/main-header";

export const metadata: Metadata = {
  title: "Money Lending App",
  description: "A web app for tracking loans.",
};

export default async function AuthRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MainHeader />
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
        <main className="mt-4 text-gray-700">{children}</main>
      </div>
    </>
  );
}
