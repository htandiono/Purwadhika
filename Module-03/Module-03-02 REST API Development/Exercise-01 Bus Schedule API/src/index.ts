import express, { Request, Response } from 'express';
import routeRoutes from './routes/routeRoutes';
import tripRoutes from './routes/tripRoutes';

const app = express();
const PORT = 3000;

app.use(express.json());

// Guide endpoint
app.get('/', (_req: Request, res: Response) => {
  const base = `http://localhost:${PORT}`;
  res.json({
    message: '🚌 Bus Schedule API',
    examples: [
      { description: 'All routes', url: `${base}/routes` },
      { description: 'Routes from Jakarta', url: `${base}/routes?from=JKT` },
      { description: 'Route detail (JKT-SUB)', url: `${base}/routes/JKT-SUB` },
      { description: 'All trips', url: `${base}/trips` },
      { description: 'Trips from Jakarta on May 1st', url: `${base}/trips?from=JKT&date=2026-05-01` },
      { description: 'On-time trips with 10+ seats', url: `${base}/trips?status=on-time&seats=10` },
    ],
  });
});

// Mount routers
app.use('/routes', routeRoutes);
app.use('/trips', tripRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Not found. Visit GET / for examples.' });
});

app.listen(PORT, () => {
  console.log(`\n🚌 Bus Schedule API → http://localhost:${PORT}\n`);
});
