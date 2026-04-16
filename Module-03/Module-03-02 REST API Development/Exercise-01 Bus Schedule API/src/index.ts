import express from 'express';
import routeRoutes from './routes/routeRoutes';
import tripRoutes from './routes/scheduleRoutes';

const app = express();
const PORT = 3000;

app.use(express.json());

// --- Mount routes ---
app.use('/routes', routeRoutes);
app.use('/trips', tripRoutes);

// --- Root: API guide with example URLs ---
app.get('/', (_req, res) => {
  const base = `http://localhost:${PORT}`;

  res.json({
    message: '🚌 Bus Schedule API',
    version: '1.0.0',
    guide: 'Use the example URLs below to explore the API.',
    endpoints: [
      {
        description: 'List all bus routes',
        url: `${base}/routes`,
      },
      {
        description: 'Routes from Jakarta',
        url: `${base}/routes?from=JKT`,
      },
      {
        description: 'Routes from Jakarta to Surabaya',
        url: `${base}/routes?from=JKT&to=SUB`,
      },
      {
        description: 'Route detail + trips',
        url: `${base}/routes/JKT-SUB`,
      },
      {
        description: 'All trips',
        url: `${base}/trips`,
      },
      {
        description: 'Trips from Jakarta on May 1st',
        url: `${base}/trips?from=JKT&date=2026-05-01`,
      },
      {
        description: 'On-time trips with 10+ seats, cheapest first',
        url: `${base}/trips?status=on-time&seats=10&sort=price&order=asc`,
      },
      {
        description: 'Next 5 departures',
        url: `${base}/trips?limit=5&sort=departure`,
      },
      {
        description: 'Single trip detail',
        url: `${base}/trips/SCH-001`,
      },
    ],
  });
});

// --- 404 handler ---
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found. Visit GET / for a guide with examples.',
  });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`\n🚌 Bus Schedule API is running on http://localhost:${PORT}`);
  console.log(`\n📍 Endpoints:`);
  console.log(`   GET /              → API guide with examples`);
  console.log(`   GET /routes        → List/filter routes (?from=JKT&to=SUB)`);
  console.log(`   GET /routes/:id    → Route detail + trips`);
  console.log(`   GET /trips         → Search trips (?from=&to=&date=&seats=&status=&limit=&sort=&order=)`);
  console.log(`   GET /trips/:id     → Trip detail\n`);
});
