export interface VisaBooking {
  _id: string;
  country: string;
  visaType: string;
  booking_type: "query" | "application";
  name: string;
  email: string;
  phone: string;
  numberOfPersons: number;
  status: "pending" | "contacted" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface VisaBookingStats {
  total: number;
  pending: number;
  contacted: number;
  closed: number;
}

export interface CreateVisaBookingInput {
  country: string;
  visaType: string;
  booking_type?: "query" | "application";
  name: string;
  email?: string | undefined;
  phone: string;
  numberOfPersons?: number;
}

export interface UpdateVisaBookingStatusInput {
  status: "pending" | "contacted" | "closed";
}
