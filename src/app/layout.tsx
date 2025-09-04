import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "ValidChat - Real-time Customer Chat Solution",
  description:
    "Bring Intercom-like live chat to your business with ease using ValidChat. Engage with your customers in real-time and boost your conversions.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#010215]">{children}</body>
    </html>
  );
}
