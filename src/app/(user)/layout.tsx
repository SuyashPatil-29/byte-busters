
import UserNavbar from "@/components/user/UserNavbar";
import { getAuthSession } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAuthSession();
  if (!session?.user.email) redirect("/sign-in");

  return (
    <div>
      <UserNavbar />
      {children}
    </div>
  );
}