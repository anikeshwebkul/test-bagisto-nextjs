import { ReactNode } from "react";

import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main>
      <Navbar />
      <div className="mx-auto min-h-[calc(100vh-450px)] w-full max-w-screen-2xl px-[15px] xss:px-7.5">
        {children}
      </div>
      <Footer />
    </main>
  );
}
