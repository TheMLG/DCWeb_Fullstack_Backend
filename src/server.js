import dotenv from "dotenv";
import connectDB from "./db/connectdb.js";
import express from "express";
import cors from "cors";
import reviewRoute from "./routes/reviewRoute.js"
dotenv.config({
    path: '../.env'
});


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

connectDB();

// Basic route
app.get('/', (_req, res) => {
    res.json({ message: 'API is running' });
});

app.use('/api/reviews', reviewRoute);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});