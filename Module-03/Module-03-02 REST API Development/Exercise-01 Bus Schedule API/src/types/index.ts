export interface Route {
  id: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  durationMinutes: number;
  operator: string;
  price: number;
}

export interface Schedule {
  id: string;
  routeId: string;
  departureDate: string;
  arrivalDate: string;
  availableSeats: number;
  totalSeats: number;
  status: "on-time" | "delayed" | "cancelled";
}

export interface Trip extends Schedule {
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  operator: string;
  price: number;
  durationMinutes: number;
}
