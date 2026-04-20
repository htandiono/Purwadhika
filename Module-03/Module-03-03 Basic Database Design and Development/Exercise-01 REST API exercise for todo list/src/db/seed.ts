import pool from './index';

const seedDatabase = async () => {
  try {
    console.log("Starting to seed the database...");

    // Generate a unique email to avoid Unique Constraint errors if run multiple times
    const randomEmail = `test_${Date.now()}@example.com`;

    // 1. Create a mock user
    const userResult = await pool.query(`
        INSERT INTO users (email, password, name) 
        VALUES ($1, $2, $3) 
        RETURNING id
      `, [randomEmail, 'password123', 'Demo User']);
    
    const userId = userResult.rows[0].id;
    console.log(`Created user with ID: ${userId}`);

    // 2. Create some sample todos for that user
    const todos = [
      { text: "Design my database schema in Supabase", completed: true },
      { text: "Set up Express and TypeScript locally", completed: true },
      { text: "Establish a connection using Postgres driver", completed: true },
      { text: "Seed the tables with mock data", completed: false },
      { text: "Connect the React frontend", completed: false },
      { text: "Celebrate my new full-stack app!", completed: false }
    ];

    for (let todo of todos) {
      await pool.query(`
        INSERT INTO todos (text, completed, user_id) 
        VALUES ($1, $2, $3)
      `, [todo.text, todo.completed, userId]);
    }

    console.log(`Successfully seeded ${todos.length} sample todos!`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // End the pool so the script gracefully closes
    pool.end();
  }
};

seedDatabase();
