import { Router, Request, Response } from 'express';
import { Route, Schedule } from '../types';
import routesData from '../data/routes.json';
import schedulesData from '../data/schedules.json';

const router = Router();
const routes = routesData as Route[];
const schedules = schedulesData as Schedule[];

// Helper to build a Trip object
function buildTrip(schedule: Schedule, route: Route) {
  return {
    ...schedule,
    origin: route.origin,
    originCode: route.originCode,
    destination: route.destination,
    destinationCode: route.destinationCode,
    operator: route.operator,
    price: route.price,
    durationMinutes: route.durationMinutes,
  };
}

/**
 * GET /trips
 * Search trips with simple filters.
 */
router.get('/', (req: Request, res: Response) => {
  let result = schedules.map(s => {
    const route = routes.find(r => r.id === s.routeId)!;
    return buildTrip(s, route);
  });

  const from = (req.query.from as string)?.toUpperCase();
  const to = (req.query.to as string)?.toUpperCase();
  const date = req.query.date as string;
  const status = (req.query.status as string)?.toLowerCase();
  const seats = parseInt(req.query.seats as string);
  const limit = parseInt(req.query.limit as string);

  if (from) result = result.filter(t => t.originCode === from);
  if (to) result = result.filter(t => t.destinationCode === to);
  if (date) result = result.filter(t => t.departureDate.startsWith(date));
  if (status) result = result.filter(t => t.status === status);
  if (!isNaN(seats)) result = result.filter(t => t.availableSeats >= seats);

  result.sort((a, b) => a.departureDate.localeCompare(b.departureDate));
  if (!isNaN(limit) && limit > 0) result = result.slice(0, limit);

  res.json({ success: true, count: result.length, data: result });
});

export default router;
