const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');

// Multer Storage 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir); 
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Create Metadata in DB
    const newVideo = new Video({
      title: req.body.title || req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      uploader: "65b2a3c4d5e6f7g8h9i0j1k2",
      status: 'pending' 
    });

    await newVideo.save();
 
    res.status(201).json(newVideo);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get All Videos Endpoint
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ uploadDate: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;