import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      {/* @ts-ignore */}
      <Navbar />
      {children}
    </div>
  );
}
