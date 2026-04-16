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
 * GET /routes
 * List all bus routes, optionally filter by origin/destination code.
 */
router.get('/', (req: Request, res: Response) => {
  let result = [...routes];
  const from = (req.query.from as string)?.toUpperCase();
  const to = (req.query.to as string)?.toUpperCase();

  if (from) result = result.filter(r => r.originCode === from);
  if (to) result = result.filter(r => r.destinationCode === to);

  res.json({ success: true, count: result.length, data: result });
});

/**
 * GET /routes/:id
 * Get a single route's info + all its trips.
 */
router.get('/:id', (req: Request<{ id: string }>, res: Response) => {
  const route = routes.find(r => r.id.toUpperCase() === req.params.id.toUpperCase());

  if (!route) {
    res.status(404).json({ success: false, message: `Route "${req.params.id}" not found.` });
    return;
  }

  const trips = schedules
    .filter(s => s.routeId === route.id)
    .sort((a, b) => a.departureDate.localeCompare(b.departureDate))
    .map(s => buildTrip(s, route));

  res.json({ success: true, data: { ...route, trips } });
});

export default router;
