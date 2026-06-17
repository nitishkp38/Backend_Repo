const express = require('express');
require('dotenv').config();
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const servicesRouter = require('./routes/services');
const providersRouter = require('./routes/providers');
const bookingsRouter = require('./routes/bookings');
const reviewsRouter = require('./routes/reviews');
const chatRouter = require('./routes/chat');
const supabase = require('./lib/supabase');

const app = express();
const port = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || 'https://backend-repo-izx5.onrender.com';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/services', servicesRouter);
app.use('/providers', providersRouter);
app.use('/bookings', bookingsRouter);
app.use('/reviews', reviewsRouter);
app.use('/chat', chatRouter);

const DB_TABLE = process.env.DB_TABLE || 'User';

async function verifySupabaseConnection() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Supabase connection failed: SUPABASE_URL or SUPABASE_KEY is not set.');
    return;
  }

  try {
    const { data, error, status, statusText } = await supabase.from(DB_TABLE).select('id').limit(1);
    if (error) {
      console.error('Supabase connection failed:', error);
      return;
    }
    console.log('Supabase connection successful.', { status, statusText, rows: data?.length });
  } catch (err) {
    console.error('Supabase connection failed:', err);
  }
}

async function showUserTableRows() {
  if (!SUPABASE_URL || !SUPABASE_KEY) return;
  try {
    const { data, error } = await supabase.from(DB_TABLE).select('*');
    if (error) {
      console.error(`Error selecting from ${DB_TABLE}:`, error);
      return;
    }
    console.log(`Rows from ${DB_TABLE}:`, JSON.stringify(data, null, 2));
    return data;
  } catch (err) {
    console.error(`Failed querying ${DB_TABLE}:`, err);
  }
}

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from the Node.js backend!',
    status: 'ready for development',
    baseUrl: BASE_URL
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Example: fetch all rows from 'users' table
app.get('/users', async (req, res) => {
  try {
    const { data, error } = await supabase.from(DB_TABLE).select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await verifySupabaseConnection();
  // query and print all rows from USER table at startup
  await showUserTableRows();
});
