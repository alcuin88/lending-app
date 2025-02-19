import type { Metadata } from "next";
import "../globals.css";
import MainHeader from "@/components/header/main-header";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Money Lending App",
  description: "A web app for tracking loans.",
};

export default async function AuthRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user_email = (await cookies()).get("user_email")?.value as string;
  user_email = user_email.split("@")[0];
  return (
    <>
      <MainHeader />
      <div className="container mx-auto max-w-4xl p-6">
        <h1 className="text-3xl font-semibold text-gray-800">
          Welcome, {user_email}!
        </h1>
        <main className="mt-4 text-gray-700">{children}</main>
      </div>
    </>
  );
}
