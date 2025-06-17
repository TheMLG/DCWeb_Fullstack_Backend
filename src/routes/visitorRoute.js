import express from 'express';
import Visitor from '../models/visitors.model.js';
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const visitor = await Visitor.findOne({});
        visitor.count++;
        await visitor.save();
        res.json({ count: visitor.count });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching visitor count' });
    }
});

export default router;