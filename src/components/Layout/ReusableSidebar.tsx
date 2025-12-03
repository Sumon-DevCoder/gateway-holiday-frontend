"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

interface SidebarItem {
  href: string;
  label: string;
  icon?: ReactNode;
}

interface SidebarSection {
  section: string;
  sectionIcon?: ReactNode;
  items: SidebarItem[];
}

interface ReusableSidebarProps {
  title: string;
  items?: SidebarItem[];
  sections?: SidebarSection[];
  basePath: string;
  variant?: "admin" | "user";
  showLogout?: boolean;
  onLogout?: () => void;
  isLoggingOut?: boolean;
}

export default function ReusableSidebar({
  title,
  items,
  sections,
  basePath,
  variant = "user",
  showLogout = false,
  onLogout,
  isLoggingOut = false,
}: ReusableSidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(() => {
    // Auto-expand section with active item
    const initial: Record<string, boolean> = {};
    if (sections && pathname) {
      sections.forEach((section) => {
        const hasActive = section.items.some(
          (item) =>
            pathname === item.href || pathname.startsWith(item.href + "/")
        );
        if (hasActive) {
          initial[section.section] = true;
        }
      });
    }
    return initial;
  });

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === basePath) {
      return pathname === href;
    }
    // For exact matches, check if pathname exactly equals href
    // For nested routes, check if pathname starts with href followed by a slash or is exactly the href
    return pathname === href || pathname.startsWith(href + "/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isSectionActive = (sectionItems: SidebarItem[]) => {
    return sectionItems.some((item) => isActive(item.href));
  };

  // Styling based on variant
  const sidebarClasses =
    variant === "admin"
      ? "bg-sidebar border-sidebar-border"
      : "bg-white shadow-lg";

  const textClasses =
    variant === "admin" ? "text-sidebar-foreground" : "text-gray-800";

  // Render navigation items
  const renderNavItems = (navItems: SidebarItem[], inMobile = false) => {
    return navItems.map((item) => {
      const linkProps: any = {
        href: item.href,
        className: cn(
          "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors",
          isActive(item.href)
            ? variant === "admin"
              ? "bg-primary text-primary-foreground font-semibold"
              : "border-r-4 border-blue-500 bg-blue-50 text-blue-700"
            : `${textClasses} opacity-80 hover:bg-sidebar-accent hover:opacity-100`
        ),
      };

      if (inMobile) {
        linkProps.onClick = toggleMobileMenu;
      }

      return (
        <Link key={item.href} {...linkProps}>
          {item.icon && (
            <span className="h-4 w-4 flex-shrink-0 opacity-70">
              {item.icon}
            </span>
          )}
          <span className="text-sm">{item.label}</span>
        </Link>
      );
    });
  };

  const renderSections = (inMobile = false) => {
    if (!sections) return null;

    return sections.map((section, index) => {
      const isExpanded = expandedSections[section.section] ?? false;
      const hasActiveItem = isSectionActive(section.items);

      return (
        <div key={section.section} className="mb-2">
          {/* Section Divider - except for first section */}
          {index > 0 && (
            <div className="border-sidebar-border mb-3 border-t opacity-20" />
          )}

          <button
            onClick={() => toggleSection(section.section)}
            className={cn(
              "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors",
              hasActiveItem
                ? "bg-primary/10 text-primary"
                : isExpanded
                  ? "bg-sidebar-accent text-primary"
                  : `${textClasses} hover:bg-sidebar-accent opacity-60 hover:opacity-100`
            )}
          >
            <div className="flex items-center gap-2">
              {section.sectionIcon && (
                <span className="h-3.5 w-3.5 flex-shrink-0">
                  {section.sectionIcon}
                </span>
              )}
              <span className="text-left">{section.section}</span>
            </div>
            <ChevronRight
              className={cn(
                "h-4 w-4 flex-shrink-0 transition-transform duration-300",
                isExpanded && "rotate-90"
              )}
            />
          </button>

          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="border-sidebar-border/50 mt-2 ml-3 space-y-1 border-l-2 pl-3">
              {renderNavItems(section.items, inMobile)}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      {/* Mobile Header */}
      <div
        className={`fixed top-0 right-0 left-0 z-50 border-b lg:hidden ${sidebarClasses}`}
      >
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <h1
              className={`text-lg font-semibold ${textClasses} cursor-pointer`}
            >
              {title}
            </h1>
          </Link>
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
          {/* Logo & Title Section */}
          <div className="border-sidebar-border flex flex-shrink-0 items-center gap-3 border-b px-6 py-4">
            <Link href="/" className="transition-opacity hover:opacity-80">
              <h1 className={`text-xl font-bold ${textClasses} cursor-pointer`}>
                {title}
              </h1>
            </Link>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {sections ? renderSections() : items && renderNavItems(items)}
          </nav>

          {/* Logout Button Section */}
          {showLogout && onLogout && (
            <div className="border-sidebar-border border-t p-4">
              <Button
                onClick={onLogout}
                className={cn(
                  "w-full",
                  variant === "admin"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-red-500 text-white hover:bg-red-600"
                )}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </div>
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
        <div className="max-h-[70vh] overflow-y-auto">
          <nav className="space-y-1 px-3 py-6">
            {sections
              ? renderSections(true)
              : items && renderNavItems(items, true)}
          </nav>

          {showLogout && onLogout && (
            <div className="border-sidebar-border border-t p-4">
              <Button
                onClick={onLogout}
                disabled={isLoggingOut}
                className={cn(
                  "w-full",
                  variant === "admin"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-red-500 text-white hover:bg-red-600"
                )}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile top padding */}
      <div className="h-16 lg:hidden" />
    </>
  );
}
