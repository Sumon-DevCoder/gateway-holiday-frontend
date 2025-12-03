import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TabsContent } from "@/components/ui/tabs";
import { ItineraryBlock, ItineraryDay, TravelPackage } from "@/lib/packageData";
import {
  Car,
  Check,
  ChevronDown,
  Clock,
  Hotel,
  Utensils,
  X,
} from "lucide-react";
import React from "react";

interface TabContentProps {
  activeTab: string;
  packageData: TravelPackage;
}

export const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  packageData,
}) => {
  const renderItineraryContent = () => {
    // Helper function to render meal information
    const renderMeals = (meals?: {
      breakfast: boolean;
      lunch: boolean;
      dinner: boolean;
    }) => {
      if (!meals) return "Not included";
      const mealList: string[] = [];
      if (meals.breakfast) mealList.push("Breakfast");
      if (meals.lunch) mealList.push("Lunch");
      if (meals.dinner) mealList.push("Dinner");
      return mealList.length > 0 ? mealList.join(", ") : "Not included";
    };

    // Helper function to get hotel name from blocks
    const getHotelName = (blocks: ItineraryBlock[]) => {
      const hotelBlock = blocks.find((block) => block.type === "HOTEL");
      return hotelBlock?.hotelName || "Not specified";
    };

    // Helper function to get transfer/transportation info
    const getTransportation = (blocks: ItineraryBlock[]) => {
      const transferBlock = blocks.find((block) => block.type === "TRANSFER");
      return transferBlock?.subtitle || transferBlock?.title || "Not specified";
    };

    return (
      <div className="space-y-3 sm:space-y-4">
        <div className="rounded-lg bg-gray-100 p-3 sm:p-4">
          <h3 className="text-sm font-semibold text-blue-600 sm:text-base md:text-lg">
            Please see below details:-
          </h3>
        </div>
        {packageData.itinerary.map((day: ItineraryDay, index: number) => (
          <Collapsible key={index} className="rounded-lg border">
            <CollapsibleTrigger className="flex w-full items-center justify-between p-3 hover:bg-gray-50 sm:p-4">
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-white sm:px-3 sm:py-1 sm:text-sm">
                    Day {day.dayNo}
                  </span>
                  <span className="text-sm font-medium sm:text-base">
                    {day.title}
                  </span>
                </div>
              </div>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3 sm:px-4 sm:pb-4">
              <div className="space-y-3 sm:space-y-4">
                {/* Render blocks */}
                {day.blocks && day.blocks.length > 0 ? (
                  day.blocks.map(
                    (block: ItineraryBlock, blockIndex: number) => (
                      <div
                        key={blockIndex}
                        className="rounded-lg border bg-gray-50 p-3 sm:p-4"
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                            {block.type}
                          </span>
                          {block.title && (
                            <span className="text-sm font-medium">
                              {block.title}
                            </span>
                          )}
                          {block.subtitle && (
                            <span className="text-xs text-gray-600">
                              {block.subtitle}
                            </span>
                          )}
                        </div>

                        {/* Time Range */}
                        {(block.timeFrom || block.timeTo) && (
                          <div className="mb-2 rounded-lg bg-blue-50 p-2 sm:p-3">
                            <div className="flex items-center gap-2 text-xs text-blue-700 sm:text-sm">
                              <Clock className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                              <span className="font-medium">
                                {block.timeFrom && block.timeTo
                                  ? `${block.timeFrom} - ${block.timeTo}`
                                  : block.timeFrom
                                    ? `From ${block.timeFrom}`
                                    : `Until ${block.timeTo}`}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Description */}
                        {block.description && (
                          <div className="mb-2 rounded-lg bg-white p-2 sm:p-3">
                            <p className="text-xs leading-relaxed text-gray-700 sm:text-sm">
                              {block.description}
                            </p>
                          </div>
                        )}

                        {/* Hotel Name */}
                        {block.type === "HOTEL" && block.hotelName && (
                          <div className="mb-2 flex items-center gap-2">
                            <Hotel className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span className="text-xs text-gray-600 sm:text-sm">
                              {block.hotelName}
                            </span>
                          </div>
                        )}

                        {/* Meals */}
                        {block.type === "MEAL" && block.meals && (
                          <div className="mb-2 flex items-center gap-2">
                            <Utensils className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span className="text-xs text-gray-600 sm:text-sm">
                              {renderMeals(block.meals)}
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  )
                ) : (
                  <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
                    <p className="text-xs text-gray-600 sm:text-sm">
                      No activities scheduled for this day.
                    </p>
                  </div>
                )}

                {/* Summary Info */}
                {day.blocks && day.blocks.length > 0 && (
                  <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
                    <div>
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold sm:text-base">
                        <Hotel className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Accommodation
                      </h4>
                      <p className="text-xs text-gray-600 sm:text-sm">
                        {getHotelName(day.blocks)}
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold sm:text-base">
                        <Utensils className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Meals
                      </h4>
                      <p className="text-xs text-gray-600 sm:text-sm">
                        {(() => {
                          const mealBlocks = day.blocks.filter(
                            (b) => b.type === "MEAL"
                          );
                          if (mealBlocks.length === 0) return "Not included";
                          const allMeals = mealBlocks
                            .map((b) => renderMeals(b.meals))
                            .filter(Boolean);
                          return allMeals.length > 0
                            ? allMeals.join(", ")
                            : "Not included";
                        })()}
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold sm:text-base">
                        <Car className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Transportation
                      </h4>
                      <p className="text-xs text-gray-600 sm:text-sm">
                        {getTransportation(day.blocks)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    );
  };

  const renderInclusionExclusionContent = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-lg bg-gray-100 p-3 sm:p-4">
        <h3 className="text-sm font-semibold text-blue-600 sm:text-base md:text-lg">
          Please see below details:-
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h4 className="mb-3 flex items-center text-base font-semibold text-green-700 sm:text-lg md:text-xl">
              <Check className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Inclusion:
            </h4>
            <ul className="space-y-2">
              {(packageData.inclusions || packageData.inclusion || []).map(
                (item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">{item}</span>
                  </li>
                )
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <h4 className="mb-3 flex items-center text-base font-semibold text-red-700 sm:text-lg md:text-xl">
              <X className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Exclusion:
            </h4>
            <ul className="space-y-2">
              {(packageData.exclusions || packageData.exclusion || []).map(
                (item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">{item}</span>
                  </li>
                )
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTermsContent = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-lg bg-gray-100 p-3 sm:p-4">
        <h3 className="text-sm font-semibold text-blue-600 sm:text-base md:text-lg">
          Please see below details:-
        </h3>
      </div>
      <div className="rounded-lg border bg-white p-3 sm:p-4">
        {packageData.terms ? (
          <p className="text-xs leading-relaxed whitespace-pre-line text-gray-700 sm:text-sm">
            {packageData.terms}
          </p>
        ) : (
          <p className="text-xs text-gray-500 sm:text-sm">
            No terms specified.
          </p>
        )}
      </div>
    </div>
  );

  const renderOtherDetailsContent = () => {
    const otherDetails = packageData?.otherDetails;

    // Check if it's a legacy object format
    const isLegacyObjectFormat =
      otherDetails &&
      typeof otherDetails === "object" &&
      !Array.isArray(otherDetails) &&
      ("transportation" in otherDetails ||
        "specialNotes" in otherDetails ||
        "contactInfo" in otherDetails ||
        "emergencyContact" in otherDetails);

    // Type assertion for legacy format
    const legacyDetails = isLegacyObjectFormat
      ? (otherDetails as {
          transportation?: string | string[];
          specialNotes?: string | string[];
          contactInfo?: string;
          emergencyContact?: string;
        })
      : null;

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="rounded-lg bg-gray-100 p-3 sm:p-4">
          <h3 className="text-sm font-semibold text-blue-600 sm:text-base md:text-lg">
            Please see below details:-
          </h3>
        </div>
        <div className="rounded-lg border bg-white p-3 sm:p-4">
          {otherDetails ? (
            typeof otherDetails === "string" ? (
              <p className="text-xs leading-relaxed whitespace-pre-line text-gray-700 sm:text-sm">
                {otherDetails}
              </p>
            ) : legacyDetails ? (
              <div className="space-y-4">
                {legacyDetails.transportation && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-gray-800">
                      Transportation
                    </h4>
                    {Array.isArray(legacyDetails.transportation) ? (
                      <ul className="list-inside list-disc space-y-1 text-xs text-gray-600 sm:text-sm">
                        {legacyDetails.transportation.map(
                          (item: string, index: number) => (
                            <li key={index}>{item}</li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-600 sm:text-sm">
                        {legacyDetails.transportation}
                      </p>
                    )}
                  </div>
                )}
                {legacyDetails.specialNotes && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-gray-800">
                      Special Notes
                    </h4>
                    {Array.isArray(legacyDetails.specialNotes) ? (
                      <ul className="list-inside list-disc space-y-1 text-xs text-gray-600 sm:text-sm">
                        {legacyDetails.specialNotes.map(
                          (item: string, index: number) => (
                            <li key={index}>{item}</li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-600 sm:text-sm">
                        {legacyDetails.specialNotes}
                      </p>
                    )}
                  </div>
                )}
                {legacyDetails.contactInfo && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-gray-800">
                      Contact Information
                    </h4>
                    <p className="text-xs text-gray-600 sm:text-sm">
                      {legacyDetails.contactInfo}
                    </p>
                  </div>
                )}
                {legacyDetails.emergencyContact && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-gray-800">
                      Emergency Contact
                    </h4>
                    <p className="text-xs text-gray-600 sm:text-sm">
                      {legacyDetails.emergencyContact}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-500 sm:text-sm">
                No additional details available.
              </p>
            )
          ) : (
            <p className="text-xs text-gray-500 sm:text-sm">
              No additional details available.
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderVisaContent = () => {
    const visaRequirements = packageData?.visaRequirements;
    const hasVisaRequirements =
      visaRequirements &&
      typeof visaRequirements === "string" &&
      visaRequirements.trim().length > 0;

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="rounded-lg bg-gray-100 p-3 sm:p-4">
          <h3 className="text-sm font-semibold text-blue-600 sm:text-base md:text-lg">
            Please see below details:-
          </h3>
        </div>
        <div className="rounded-lg border bg-white p-3 sm:p-4">
          {hasVisaRequirements ? (
            <div className="space-y-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="text-2xl sm:text-3xl">📋</div>
                <h3 className="text-lg font-semibold sm:text-xl">
                  Visa Requirements
                </h3>
              </div>
              <div className="rounded-lg bg-blue-50 p-4 sm:p-6">
                <p className="text-xs leading-relaxed whitespace-pre-line text-gray-700 sm:text-sm">
                  {typeof visaRequirements === "string"
                    ? visaRequirements
                    : String(visaRequirements)}
                </p>
              </div>
            </div>
          ) : (
            <div className="px-4 py-8 text-center sm:py-12">
              <div className="mb-3 text-4xl sm:mb-4 sm:text-5xl md:text-6xl">
                ✅
              </div>
              <h3 className="mb-2 text-lg font-semibold sm:text-xl">
                No Visa Required
              </h3>
            </div>
          )}
        </div>
      </div>
    );
  };

  const getContent = () => {
    switch (activeTab) {
      case "itinerary":
        return renderItineraryContent();
      case "inclusion":
        return renderInclusionExclusionContent();
      case "terms":
        return renderTermsContent();
      case "details":
        return renderOtherDetailsContent();
      case "visa":
        return renderVisaContent();
      default:
        return null;
    }
  };

  return (
    <TabsContent value={activeTab} className="p-3 sm:p-4 md:p-6">
      {getContent()}
    </TabsContent>
  );
};
