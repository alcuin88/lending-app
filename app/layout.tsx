import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Money Lending App",
  description: "A web app for tracking loans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[bg-[#FAFAFA] text-[#212121]">
        <div className="w-11/12 max-w-7xl my-8 mx-auto">
          <main className="font-sans font-normal">{children}</main>
        </div>
      </body>
    </html>
  );
}
