"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header isAuthenticated />
      <section className="min-h-[calc(100vh-88px)] mt-[88px] text-white bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#020617] via-[#071025] to-[#041021]">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-6 flex">
          <main className="flex-1 min-h-[70vh] bg-white/5 border border-white/10 rounded-2xl overflow-y-auto">
            {children}
          </main>
        </div>
      </section>
      <Footer />
    </div>
  );
}
