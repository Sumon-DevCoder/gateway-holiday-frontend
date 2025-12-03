"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import logo from "../../../public/logo/logo.jpg";

interface SidebarItem {
  href: string;
  label: string;
  icon?: ReactNode;
}

interface SidebarProps {
  title: string;
  items: SidebarItem[];
  basePath: string; // e.g., "/dashboard/admin" or "/dashboard/user"
  showLogout?: boolean;
  onLogout?: () => void;
  isLoggingOut?: boolean;
  variant?: "admin" | "user"; // Different styling variants
}

export default function Sidebar({
  title,
  items,
  basePath,
  showLogout = false,
  onLogout,
  isLoggingOut = false,
  variant = "user",
}: SidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === basePath) {
      return pathname === href;
    }
    return pathname?.startsWith(href) || false;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Different styling based on variant
  const sidebarClasses =
    variant === "admin"
      ? "bg-sidebar border-sidebar-border"
      : "bg-white shadow-lg";

  const textClasses =
    variant === "admin" ? "text-sidebar-foreground" : "text-gray-800";

  const activeClasses =
    variant === "admin"
      ? "bg-primary text-white"
      : "bg-blue-50 border-r-4 border-blue-500 text-blue-700";

  const hoverClasses =
    variant === "admin"
      ? "hover:bg-primary hover:text-primary-foreground"
      : "hover:bg-gray-100";

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div
        className={`fixed top-0 right-0 left-0 z-50 border-b lg:hidden ${sidebarClasses}`}
      >
        <div className="flex items-center justify-between p-4">
          {variant === "admin" && (
            <Link href={"/"}>
              <Image
                src={"/public/logo/logo.png"}
                height={100}
                width={100}
                className="size-12 rounded-full"
                alt="logo"
              />
            </Link>
          )}
          <h1 className={`text-lg font-semibold ${textClasses}`}>{title}</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className={`${textClasses} hover:bg-sidebar-accent`}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="z-50 hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div
          className={`flex flex-grow flex-col overflow-y-auto border-r ${sidebarClasses}`}
        >
          <div className="flex flex-shrink-0 items-center gap-2 px-6 py-4">
            {variant === "admin" && (
              <Link href={"/"}>
                <Image
                  src={logo}
                  height={100}
                  width={100}
                  className="size-10 rounded-full"
                  alt="logo"
                />
              </Link>
            )}
            <h1 className={`text-xl font-bold ${textClasses}`}>{title}</h1>
          </div>
          <nav className="flex-1 space-y-1 px-4 pb-4">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? activeClasses
                    : `${textClasses} ${hoverClasses}`
                )}
              >
                {item.icon && (
                  <span className="mr-3 h-5 w-5 flex-shrink-0">
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          {showLogout && onLogout && (
            <Button
              onClick={onLogout}
              className="mx-4 mb-4"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-40 bg-black lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          `fixed right-0 bottom-0 left-0 z-50 transform border-t transition-transform duration-300 ease-in-out lg:hidden ${sidebarClasses}`,
          isMobileMenuOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="max-h-96 overflow-y-auto">
          <nav className="space-y-2 px-4 py-6">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={toggleMobileMenu}
                className={cn(
                  "group flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? variant === "admin"
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "bg-blue-50 text-blue-700"
                    : `${textClasses} hover:bg-sidebar-primary hover:text-sidebar-primary-foreground`
                )}
              >
                {item.icon && (
                  <span className="mr-4 h-5 w-5 flex-shrink-0">
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </Link>
            ))}
            {showLogout && onLogout && (
              <Button
                onClick={onLogout}
                disabled={isLoggingOut}
                className="w-full"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile top padding for fixed header */}
      <div className="h-16 lg:hidden" />
    </>
  );
}
