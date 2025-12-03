import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckSquare,
  ChevronUp,
  Globe,
  MessageSquare,
  Shield,
} from "lucide-react";
import React from "react";

interface BookingTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export const BookingTabs: React.FC<BookingTabsProps> = ({
  activeTab,
  onTabChange,
  children,
}) => {
  return (
    <Card className="shadow-lg">
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <div className="rounded-t-lg bg-gradient-to-r from-blue-50 to-blue-100 p-1">
          <div className="overflow-x-auto">
            <TabsList className="flex h-auto w-full min-w-max gap-1 bg-transparent p-0 md:grid md:min-w-0 md:grid-cols-5">
              <TabsTrigger
                value="itinerary"
                className="flex min-w-[90px] flex-col items-center gap-1.5 rounded-lg px-2 py-3 transition-all duration-300 hover:bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg sm:min-w-[100px] sm:px-3 md:min-w-0 md:gap-2 md:py-4"
              >
                <CheckSquare className="h-4 w-4 md:h-5 md:w-5" />
                <span className="text-xs font-semibold whitespace-nowrap sm:text-sm">
                  Itinerary
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="inclusion"
                className="flex min-w-[90px] flex-col items-center gap-1.5 rounded-lg px-2 py-3 transition-all duration-300 hover:bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg sm:min-w-[100px] sm:px-3 md:min-w-0 md:gap-2 md:py-4"
              >
                <CheckSquare className="h-4 w-4 md:h-5 md:w-5" />
                <span className="text-center text-xs leading-tight font-semibold sm:text-sm">
                  Inclusion & Exclusion
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="terms"
                className="flex min-w-[90px] flex-col items-center gap-1.5 rounded-lg px-2 py-3 transition-all duration-300 hover:bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg sm:min-w-[100px] sm:px-3 md:min-w-0 md:gap-2 md:py-4"
              >
                <Shield className="h-4 w-4 md:h-5 md:w-5" />
                <span className="text-center text-xs leading-tight font-semibold sm:text-sm">
                  Terms & Conditions
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="flex min-w-[90px] flex-col items-center gap-1.5 rounded-lg px-2 py-3 transition-all duration-300 hover:bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg sm:min-w-[100px] sm:px-3 md:min-w-0 md:gap-2 md:py-4"
              >
                <MessageSquare className="h-4 w-4 md:h-5 md:w-5" />
                <span className="text-center text-xs leading-tight font-semibold sm:text-sm">
                  Other Details
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="visa"
                className="flex min-w-[90px] flex-col items-center gap-1.5 rounded-lg px-2 py-3 transition-all duration-300 hover:bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg sm:min-w-[100px] sm:px-3 md:min-w-0 md:gap-2 md:py-4"
              >
                <Globe className="h-4 w-4 md:h-5 md:w-5" />
                <span className="text-center text-xs leading-tight font-semibold sm:text-sm">
                  Visa Requirements
                </span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 w-full bg-gray-200">
          <div className="absolute top-0 left-0 h-full w-full rounded-full bg-gray-200"></div>
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
            style={{
              width: `${
                (["itinerary", "inclusion", "terms", "details", "visa"].indexOf(
                  activeTab
                ) +
                  1) *
                20
              }%`,
            }}
          ></div>
        </div>

        {/* Active Tab Title */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-2 py-3 text-center md:py-4">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-blue-600 shadow-lg sm:px-6 sm:text-base md:gap-2 md:px-8 md:py-3 md:text-lg lg:text-xl">
            {activeTab === "itinerary" && "Itinerary Details"}
            {activeTab === "inclusion" && "Package Inclusion & Exclusion"}
            {activeTab === "terms" && "Terms & Conditions"}
            {activeTab === "details" && "Other Details"}
            {activeTab === "visa" && "Visa Requirements"}
            <ChevronUp className="h-4 w-4 md:h-5 md:w-5" />
          </div>
        </div>

        {children}
      </Tabs>
    </Card>
  );
};
