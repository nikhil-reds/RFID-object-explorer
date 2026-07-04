import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Object Atlas — RFID Explorer",
  description: "An interactive RFID-powered object discovery table",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
