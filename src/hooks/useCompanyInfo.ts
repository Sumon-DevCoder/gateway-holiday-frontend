import { companyInfo as staticCompanyInfo } from "@/data/company";
import { useGetAllCompanyInfoQuery } from "@/redux/api/features/companyInfo/companyInfoApi";

/**
 * Custom hook to get company information with fallback to static data
 * This hook ensures we only make one API call and share the data across components
 *
 * Usage examples:
 * - const { companyInfo } = useCompanyInfo(); // Basic usage
 * - const { companyInfo, isLoading } = useCompanyInfo(); // With loading state
 * - const { getPrimaryPhone, getPrimaryEmail } = useCompanyInfo(); // Helper methods
 */
export const useCompanyInfo = () => {
  const {
    data: companyInfoResponse,
    isLoading,
    error,
  } = useGetAllCompanyInfoQuery();

  // Extract company data from API response, fallback to static data
  const apiCompanyData = Array.isArray(companyInfoResponse?.data)
    ? companyInfoResponse?.data?.[0]
    : companyInfoResponse?.data;

  // Use API data if available, otherwise use static fallback data
  const companyInfo = apiCompanyData || staticCompanyInfo;

  // Helper functions for common data access patterns
  const getPrimaryPhone = () =>
    companyInfo?.phone?.[0] || staticCompanyInfo.phone[0];
  const getPrimaryEmail = () =>
    companyInfo?.email?.[0] || staticCompanyInfo.email[0];
  const getCompanyName = () =>
    companyInfo?.companyName || staticCompanyInfo.companyName;
  const getAddress = () => companyInfo?.address || staticCompanyInfo.address;
  const getOpeningHours = () => {
    if (companyInfo?.openingHours) return companyInfo.openingHours;
    if ((companyInfo as any)?.officeHours?.length) {
      const mondayHours = (companyInfo as any).officeHours.find(
        (hour: any) => hour.day === "Monday"
      );
      if (mondayHours) return `${mondayHours.open} - ${mondayHours.close}`;
      return `${(companyInfo as any).officeHours[0].open} - ${(companyInfo as any).officeHours[0].close}`;
    }
    return staticCompanyInfo.openingHours;
  };
  const getSocialLinks = () =>
    companyInfo?.socialLinks || staticCompanyInfo.socialLinks;
  const getGoogleMapUrl = () =>
    companyInfo?.googleMapUrl || staticCompanyInfo.googleMapUrl;
  const getDescription = () =>
    companyInfo?.description || staticCompanyInfo.description;
  const getLogo = () => (companyInfo as any)?.logo || staticCompanyInfo.logo;
  const getYearsOfExperience = () =>
    (companyInfo as any)?.yearsOfExperience || 0;
  const getCustomerReviewCount = () => {
    const value =
      (companyInfo as any)?.customer_review ??
      staticCompanyInfo.customer_review ??
      "0";

    if (value === null || value === undefined) {
      return "0";
    }

    if (typeof value === "number") {
      return String(value);
    }

    return String(value).trim() || "0";
  };
  const getDestinations = () => {
    const value =
      (companyInfo as any)?.destinations ??
      staticCompanyInfo.destinations ??
      "50+";

    if (value === null || value === undefined) {
      return "50+";
    }

    if (typeof value === "number") {
      return String(value);
    }

    return String(value).trim() || "50+";
  };

  return {
    // Main data
    companyInfo,
    isLoading,
    error,
    isFromAPI: !!apiCompanyData,

    // Helper functions for easy access
    getPrimaryPhone,
    getPrimaryEmail,
    getCompanyName,
    getAddress,
    getOpeningHours,
    getSocialLinks,
    getGoogleMapUrl,
    getDescription,
    getLogo,
    getYearsOfExperience,
    getCustomerReviewCount,
    getDestinations,
  };
};
