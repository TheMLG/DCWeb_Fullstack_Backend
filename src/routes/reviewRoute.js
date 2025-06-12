import express from 'express';
import Review from '../models/review.model.js'; 

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, email, phone, rating, comment } = req.body;

        if (!name || !rating || !comment || !email || !phone) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        const newReview = new Review({
            name,
            rating,
            email,
            phone,
            comment,
            createdAt: new Date()
        });

        const savedReview = await newReview.save();

        return res.status(201).json({
            message: 'Review submitted successfully.',
            review: savedReview
        });
    } catch (error) {
        console.error('Error submitting review:', error);
        return res.status(500).json({ message: 'Server error submitting review.' });
    }
});

router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Server error fetching reviews.' });
    }
});

export default router;
