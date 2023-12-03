// server.mjs
import express from 'express';
// import { PORT } from './constant.mjs';


import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
import authRoutes from './src/routes/Authroutes.mjs';
import invoicesRoutes from './src/routes/Invoices.mjs';
import dbRoutes from './src/routes/Queries.mjs';

app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/queries', dbRoutes);

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
