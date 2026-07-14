import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HabitProof — Own your streaks",
  description:
    "HabitProof stores your daily habits onchain on Monad Testnet, so no app can reset, fake, or take your streak from you. Tamper-proof. Yours.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0d0b08] text-[#6a7a72] antialiased">
        {children}
      </body>
    </html>
  );
}
