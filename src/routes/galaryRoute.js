import express from 'express';
const router = express.Router();
import Gallery from '../models/gallary.model.js';

// GET /gallery - get all images
router.get('/gallery', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /gallery - add new image
router.post('/gallery', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ message: 'Image URL is required' });
  }
  try {
    const newImage = new Gallery({ url });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /gallery/:id - delete image by id
router.delete('/gallery/:id', async (req, res) => {
  try {
    const deleted = await Gallery.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
