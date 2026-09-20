"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<LinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

function NavLink({ className, activeClassName, pendingClassName: _pendingClassName, href, ...props }: NavLinkCompatProps) {
  const pathname = usePathname();
  const hrefValue = typeof href === "string" ? href : href.toString();
  const isActive = hrefValue === pathname;

  return <Link href={href} className={cn(className, isActive && activeClassName)} {...props} />;
}

export { NavLink };
