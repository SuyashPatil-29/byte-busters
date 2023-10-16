import Link from "next/link";
import { GraduationCap, Instagram } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";
import { HeaderLink } from "./HeaderLink";
import { UserDropdown } from "./Userdropdown";

export default function UserNavbar() {
  return (
    <header className=" h-20 border-b z-50 sticky shrink-0 flex items-center justify-between px-6 md:px-28 top-0 left-0 shadow-sm bg-background">
      <Sidebar />
      <div className="hidden md:flex items-center space-x-10">
        <Link href="/" className="flex items-center">
          <GraduationCap className="h-6 w-6 mr-2.5" />
          <h1 className="font-semibold text-xl">PDFILE</h1>
        </Link>
        <div className="flex items-center space-x-8 text-sm font-medium">
          <HeaderLink href="/dashboard">Dashboard</HeaderLink>
          <HeaderLink href="/chat">File Chat</HeaderLink>
          <HeaderLink href="/language-translator">Language Translator</HeaderLink>
        </div>
      </div>

      <div className="flex items-center">
        <a href="https://www.instagram.com/_suyashpatil_/" className="mr-3">
          <Button variant="ghost">
            <Instagram className="h-5 w-5" />
          </Button>
        </a>
        <UserDropdown />
      </div>
    </header>
  );
}