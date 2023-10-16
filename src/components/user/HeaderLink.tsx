"use client";

import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface HeaderLinkProps extends LinkProps {
  children?: ReactNode;
}

export function HeaderLink({ ...props }: HeaderLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      className={cn(
        "transition-colors text-base hover:text-foreground/80 text-foreground/60",
        pathname == props.href && "text-foreground",
      )}
      {...props}
    >
      {props.children}
    </Link>
  );
}