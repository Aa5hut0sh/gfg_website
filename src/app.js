import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import executiveRoutes from './routes/executiveRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(express.json());

// Routes
app.use('/api/executives', executiveRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});