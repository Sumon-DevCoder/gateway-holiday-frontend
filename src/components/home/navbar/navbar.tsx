"use client";

import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import { useAppSelector } from "@/redux/store";
import { NavbarProps } from "@/types/company";
import { useEffect, useState } from "react";
import MainNavbar from "./mainNavbar";
import TopNavbar from "./topNavbar";

export default function Navbar({ isLoggedIn: propIsLoggedIn }: NavbarProps) {
  // Get authentication state from Redux
  const { user, token } = useAppSelector((state) => state.auth);
  const isLoggedIn = propIsLoggedIn || !!(user && token);
  const userType = user?.role || "user";
  const [isScrolled, setIsScrolled] = useState(false);

  // Get company info using custom hook
  const { companyInfo: companyData } = useCompanyInfo();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-50 w-full bg-white shadow-sm transition-all duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Left side - Logo Section */}
        {/* <div className="flex w-28 items-center sm:w-36 md:w-40">
          
        </div> */}

        {/* Right side - Navigation Section */}
        <div className="w-full flex-grow">
          <div className={`transition-all duration-300`}>
            <div>
              <TopNavbar
                companyData={companyData}
                isLoggedIn={isLoggedIn}
                userType={userType}
                isScrolled={isScrolled}
              />
            </div>

            {/* Main Navbar - always visible */}
            <MainNavbar
              isLoggedIn={isLoggedIn}
              userType={userType}
              isScrolled={isScrolled}
              onDropdownToggle={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
