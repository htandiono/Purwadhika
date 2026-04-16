import { Router, Request, Response } from 'express';
import { Route, Schedule, Trip, TripQueryParams, ApiResponse, ApiErrorResponse } from '../types';
import routesData from '../data/routes.json';
import schedulesData from '../data/schedules.json';

const router = Router();

const routes: Route[] = routesData as Route[];
const schedules: Schedule[] = schedulesData as Schedule[];

// Helper: combine a schedule + its route into a flat Trip object
function toTrip(schedule: Schedule, route: Route): Trip {
  return {
    id: schedule.id,
    routeId: route.id,
    origin: route.origin,
    originCode: route.originCode,
    destination: route.destination,
    destinationCode: route.destinationCode,
    operator: route.operator,
    price: route.price,
    departureDate: schedule.departureDate,
    arrivalDate: schedule.arrivalDate,
    durationMinutes: route.durationMinutes,
    availableSeats: schedule.availableSeats,
    totalSeats: schedule.totalSeats,
    status: schedule.status,
  };
}

/**
 * GET /trips
 *
 * Search bus trips with simple filters.
 *
 * Query params:
 *   from     - origin city code (e.g. "JKT")
 *   to       - destination city code (e.g. "SUB")
 *   route    - route ID (e.g. "JKT-SUB")
 *   date     - departure date (YYYY-MM-DD)
 *   status   - "on-time", "delayed", or "cancelled"
 *   seats    - minimum available seats
 *   limit    - max results to return
 *   sort     - sort by: "departure", "arrival", "seats", "price"
 *   order    - "asc" (default) or "desc"
 *
 * Examples:
 *   /trips
 *   /trips?from=JKT&to=SUB
 *   /trips?date=2026-05-01
 *   /trips?from=JKT&date=2026-05-01&seats=5
 *   /trips?status=on-time&limit=5
 *   /trips?sort=price&order=asc
 */
router.get('/', (req: Request<{}, {}, {}, TripQueryParams>, res: Response): void => {
  // Start with all schedules, build Trip objects
  let trips: Trip[] = schedules.map(schedule => {
    const route = routes.find(r => r.id === schedule.routeId)!;
    return toTrip(schedule, route);
  });

  // --- Filters ---

  if (req.query.from) {
    const from = req.query.from.toUpperCase();
    trips = trips.filter(t => t.originCode.toUpperCase() === from);
  }

  if (req.query.to) {
    const to = req.query.to.toUpperCase();
    trips = trips.filter(t => t.destinationCode.toUpperCase() === to);
  }

  if (req.query.route) {
    const routeId = req.query.route.toUpperCase();
    trips = trips.filter(t => t.routeId.toUpperCase() === routeId);
  }

  if (req.query.date) {
    const date = req.query.date; // "YYYY-MM-DD"
    trips = trips.filter(t => t.departureDate.startsWith(date));
  }

  if (req.query.status) {
    const status = req.query.status.toLowerCase();
    trips = trips.filter(t => t.status === status);
  }

  if (req.query.seats) {
    const minSeats = parseInt(req.query.seats, 10);
    if (!isNaN(minSeats)) {
      trips = trips.filter(t => t.availableSeats >= minSeats);
    }
  }

  // --- Sorting ---

  const sortMap: Record<string, keyof Trip> = {
    departure: 'departureDate',
    arrival: 'arrivalDate',
    seats: 'availableSeats',
    price: 'price',
  };

  const sortField = sortMap[req.query.sort || 'departure'] || 'departureDate';
  const order = req.query.order?.toLowerCase() === 'desc' ? -1 : 1;

  trips.sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal) * order;
    }
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return (aVal - bVal) * order;
    }
    return 0;
  });

  // --- Limit ---

  if (req.query.limit) {
    const limit = parseInt(req.query.limit, 10);
    if (!isNaN(limit) && limit > 0) {
      trips = trips.slice(0, limit);
    }
  }

  const response: ApiResponse<Trip[]> = {
    success: true,
    count: trips.length,
    data: trips,
  };

  res.json(response);
});

/**
 * GET /trips/:id
 *
 * Get a single trip by ID.
 *
 * Example:
 *   /trips/SCH-001
 */
router.get('/:id', (req: Request<{ id: string }>, res: Response): void => {
  const tripId = req.params.id.toUpperCase();
  const schedule = schedules.find(s => s.id.toUpperCase() === tripId);

  if (!schedule) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      message: `Trip "${req.params.id}" not found. Try GET /trips to see all trips.`,
    };
    res.status(404).json(errorResponse);
    return;
  }

  const route = routes.find(r => r.id === schedule.routeId)!;
  const trip = toTrip(schedule, route);

  const response: ApiResponse<Trip> = {
    success: true,
    count: 1,
    data: trip,
  };

  res.json(response);
});

export default router;
