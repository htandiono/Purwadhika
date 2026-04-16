// ===== Data Models =====

export interface Route {
  id: string;              // e.g. "JKT-SUB"
  origin: string;          // e.g. "Jakarta"
  originCode: string;      // e.g. "JKT"
  destination: string;     // e.g. "Surabaya"
  destinationCode: string; // e.g. "SUB"
  durationMinutes: number; // e.g. 720 (12 hours)
  operator: string;        // e.g. "Sinar Jaya"
  price: number;           // in IDR, e.g. 350000
}

export interface Schedule {
  id: string;            // e.g. "SCH-001"
  routeId: string;       // references Route.id
  departureDate: string; // ISO 8601, e.g. "2026-05-01T08:00:00"
  arrivalDate: string;   // ISO 8601, e.g. "2026-05-01T20:00:00"
  availableSeats: number;
  totalSeats: number;
  status: "on-time" | "delayed" | "cancelled";
}

// ===== Flattened Trip (Schedule + Route info combined) =====

export interface Trip {
  id: string;
  routeId: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  operator: string;
  price: number;
  departureDate: string;
  arrivalDate: string;
  durationMinutes: number;
  availableSeats: number;
  totalSeats: number;
  status: "on-time" | "delayed" | "cancelled";
}

// ===== Query Parameters =====

export interface RouteQueryParams {
  from?: string;        // origin code, e.g. "JKT"
  to?: string;          // destination code, e.g. "SUB"
}

export interface TripQueryParams {
  from?: string;         // origin code
  to?: string;           // destination code
  route?: string;        // route ID, e.g. "JKT-SUB"
  date?: string;         // departure date "YYYY-MM-DD"
  status?: string;       // "on-time", "delayed", "cancelled"
  seats?: string;        // minimum available seats
  limit?: string;        // max number of results
  sort?: string;         // "departure", "arrival", "seats", "price"
  order?: string;        // "asc" or "desc"
}

// ===== API Response =====

export interface ApiResponse<T> {
  success: boolean;
  count: number;
  data: T;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
}

export interface RouteWithTrips extends Route {
  trips: Trip[];
}
