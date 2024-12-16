import express from 'express';
import http from 'http';
import cors from 'cors';
import setupSocketIO from "./server";
import gridRoutes from './routes/grid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/grid', gridRoutes);

// Setup Socket.IO
setupSocketIO(httpServer);

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});