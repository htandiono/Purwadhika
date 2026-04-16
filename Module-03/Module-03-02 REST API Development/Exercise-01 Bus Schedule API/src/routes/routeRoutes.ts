import { Router, Request, Response } from 'express';
import { Route, Schedule, Trip, RouteQueryParams, ApiResponse, ApiErrorResponse, RouteWithTrips } from '../types';
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
 * GET /routes
 *
 * List all bus routes. Filter with ?from= and ?to=
 *
 * Examples:
 *   /routes
 *   /routes?from=JKT
 *   /routes?to=SUB
 *   /routes?from=JKT&to=SUB
 */
router.get('/', (req: Request<{}, {}, {}, RouteQueryParams>, res: Response): void => {
  let filtered = [...routes];

  if (req.query.from) {
    const from = req.query.from.toUpperCase();
    filtered = filtered.filter(r => r.originCode.toUpperCase() === from);
  }

  if (req.query.to) {
    const to = req.query.to.toUpperCase();
    filtered = filtered.filter(r => r.destinationCode.toUpperCase() === to);
  }

  const response: ApiResponse<Route[]> = {
    success: true,
    count: filtered.length,
    data: filtered,
  };

  res.json(response);
});

/**
 * GET /routes/:id
 *
 * Get a route's info along with all its upcoming trips.
 *
 * Examples:
 *   /routes/JKT-SUB
 */
router.get('/:id', (req: Request<{ id: string }>, res: Response): void => {
  const routeId = req.params.id.toUpperCase();
  const route = routes.find(r => r.id.toUpperCase() === routeId);

  if (!route) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      message: `Route "${req.params.id}" not found. Try GET /routes to see all routes.`,
    };
    res.status(404).json(errorResponse);
    return;
  }

  // Build flat trips for this route, sorted by departure
  const trips = schedules
    .filter(s => s.routeId.toUpperCase() === routeId)
    .sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime())
    .map(s => toTrip(s, route));

  const response: ApiResponse<RouteWithTrips> = {
    success: true,
    count: 1,
    data: {
      ...route,
      trips,
    },
  };

  res.json(response);
});

export default router;
