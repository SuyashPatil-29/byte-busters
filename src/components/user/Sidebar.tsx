"use client";

import { GraduationCap, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { useState } from "react";

import { HeaderLink } from "./HeaderLink";

export function Sidebar() {
  const [sidebar, setSidebar] = useState<boolean>(false);

  return (
    <Sheet open={sidebar} onOpenChange={() => setSidebar(!sidebar)}>
      <SheetTrigger asChild className="cursor-pointer md:hidden">
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-[275px]">
        <SheetHeader>
          <Link href="/dashboard" className="flex items-center">
            <GraduationCap className="h-6 w-6 mr-2" />
            <h1 className="font-semibold text-xl font-cal">
              PDFile
            </h1>
          </Link>
        </SheetHeader>
        <div className="flex flex-col mt-6 space-y-3 font-medium">
          <HeaderLink onClick={() => setSidebar(false)} href="/dashboard">
            Dashboard
          </HeaderLink>
          <HeaderLink onClick={() => setSidebar(false)} href="/chat">
            File Chat
          </HeaderLink>
          <HeaderLink onClick={() => setSidebar(false)} href="/codegenerator">
            Code Generator
          </HeaderLink>
        </div>
      </SheetContent>
    </Sheet>
  );
}