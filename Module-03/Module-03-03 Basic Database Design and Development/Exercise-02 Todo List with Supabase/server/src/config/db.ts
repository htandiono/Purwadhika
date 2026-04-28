import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// The slide uses separated credentials (user, host, database, password), 
// but since we are using Supabase, passing the full connectionString is mathematically equivalent and much safer!
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
