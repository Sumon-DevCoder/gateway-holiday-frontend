export type FormType = "hajj_umrah" | "package_tour";
export type AirlineTicketCategory = "economy" | "business" | "first_class";
export type AccommodationType = "2_star" | "3_star" | "4_star" | "5_star";
export type QueryStatus = "pending" | "reviewed" | "contacted" | "closed";

export interface IQuery {
  _id?: string;
  formType: "hajj_umrah" | "package_tour";
  name: string;
  email: string;
  contactNumber: string;
  startingDate: Date;
  returnDate: Date;
  airlineTicketCategory: AirlineTicketCategory;
  specialRequirements?: string;
  nightsStayMakkah?: number;
  nightsStayMadinah?: number;
  maleAdults?: number;
  femaleAdults?: number;
  childs?: number;
  accommodationType?: "2_star" | "3_star" | "4_star" | "5_star";
  foodsIncluded?: boolean;
  guideRequired?: boolean;
  privateTransportation?: boolean;
  visitingCountry?: string;
  visitingCities?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
