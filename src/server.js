import dotenv from "dotenv";
import connectDB from "./db/connectdb.js";
import express from "express";
import cors from "cors";

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}



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

import cron from 'node-cron';

cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
});

import reviewRoute from "./routes/reviewRoute.js"
import contributeRoute from "./routes/contributeRoute.js";
import fundRoute from "./routes/fundRoute.js"
import advertisementRoute from "./routes/advertisementRoute.js"
import adminRoute from "./routes/adminRoute.js"
import galaryRoute from "./routes/galaryRoute.js"
import visitorRoute from "./routes/visitorRoute.js"

app.use('/api/visitor-count', visitorRoute);
app.use('/api/gallery', galaryRoute);
app.use('/api/fund', fundRoute)
app.use('/api/contribute', contributeRoute)
app.use('/api/reviews', reviewRoute);
app.use('/api/advertisement', advertisementRoute);
app.use('/api/mag', adminRoute);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});