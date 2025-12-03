export type QueryFormType = "hajj_umrah" | "package_tour" | "group_ticket";
export type QueryStatus = "pending" | "reviewed" | "contacted" | "closed";
export type AirlineTicketCategory = "economy" | "business" | "first_class";
export type AccommodationType = "2_star" | "3_star" | "4_star" | "5_star";

export interface IQuery {
  _id: string;

  // Form identification
  formType: QueryFormType;

  // Common fields
  name: string;
  email?: string;
  contactNumber: string;
  startingDate: string;
  returnDate: string;
  airlineTicketCategory?: AirlineTicketCategory;
  specialRequirements?: string;

  // Hajj & Umrah specific fields
  nightsStayMakkah?: number;
  nightsStayMadinah?: number;
  maleAdults?: number;
  femaleAdults?: number;
  childs?: number;
  accommodationType?: AccommodationType;
  foodsIncluded?: boolean;
  guideRequired?: boolean;
  privateTransportation?: boolean;

  // Package Tour specific fields
  visitingCountry?: string;
  visitingCities?: string;
  persons?: number;
  needsVisa?: boolean;

  // Group Ticket specific fields
  totalPassengers?: number;

  // Query Status
  status: QueryStatus;

  createdAt: string;
  updatedAt: string;
}

export interface CreateQueryRequest {
  formType: QueryFormType;
  name: string;
  email?: string;
  contactNumber: string;
  startingDate: string;
  returnDate: string;
  airlineTicketCategory?: AirlineTicketCategory;
  specialRequirements?: string;

  // Hajj & Umrah specific fields
  nightsStayMakkah?: number;
  nightsStayMadinah?: number;
  maleAdults?: number;
  femaleAdults?: number;
  childs?: number;
  accommodationType?: AccommodationType;
  foodsIncluded?: boolean;
  guideRequired?: boolean;
  privateTransportation?: boolean;

  // Package Tour specific fields
  visitingCountry?: string;
  visitingCities?: string;
  persons?: number;
  needsVisa?: boolean;

  // Group Ticket specific fields
  totalPassengers?: number;
}

export interface UpdateQueryRequest {
  status?: QueryStatus;
  name?: string;
  email?: string;
  contactNumber?: string;
  specialRequirements?: string;
}

export interface QueryFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  formType?: QueryFormType;
  status?: QueryStatus;
}

export interface QueryStats {
  totalQueries: number;
  todayQueries: number;
  weekQueries: number;
  monthQueries: number;
  pendingQueries: number;
  reviewedQueries: number;
  contactedQueries: number;
  closedQueries: number;
  hajjUmrahQueries: number;
  packageTourQueries: number;
}

export interface QueriesResponse {
  data: IQuery[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
