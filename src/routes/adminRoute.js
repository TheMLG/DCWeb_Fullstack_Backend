import express from 'express';
import magcarddata from '../models/magcard.model.js';

const router = express.Router();

// POST / - receive data from frontend and store it
router.post('/', async (req, res) => {
    try {
        const { title, date, pdfurl, imgurl } = req.body;

        // Validate input
        if (!title || !date || !pdfurl || !imgurl) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        const newmagcarddata = new magcarddata({
            title,
            date,
            pdfurl,
            imgurl,
            
        });

        const savedMagcarddata = await newmagcarddata.save();

        return res.status(201).json({
            message: 'Magcard Data submitted successfully',
            review: savedMagcarddata
        });

    } catch (error) {
        console.error("Error submitting the card", error);
        return res.status(500).json({ message: 'Error creating magcard data' });
    }
});

//Update likes
router.post('/:id/like', async (req, res) => {
  try {
    const magazine = await magcarddata.findById(req.params.id);
    if (magazine) {
      magazine.likes += 1;
      await magazine.save();
      res.json(magazine);
    } else {
      res.status(404).send('Magazine not found');
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
});


// Update views
router.post('/:id/view', async (req, res) => {
  try {
    const magazine = await magcarddata.findById(req.params.id);
    if (magazine) {
      magazine.views += 1;
      await magazine.save();
      res.json(magazine);
    } else {
      res.status(404).send('Magazine not found');
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// GET / - send all stored data to frontend
router.get('/', async (req, res) => {
    try {
        const magcarddatas = await magcarddata.find().sort({ createdAt: -1 }); // newest first
        res.json(magcarddatas);
    } catch (error) {
        console.error('Error fetching magcarddatas:', error);
        res.status(500).json({ message: 'Server error fetching magcarddatas.' });
    }
});

export default router;
