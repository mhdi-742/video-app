const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const Video = require('../models/Video');
const verifyToken = require('../middleware/auth');
const { analyzeVideo } = require('../utils/videoprocessor'); 
const path = require('path');

// Multer Config 
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

// UPLOAD ROUTE
router.post('/upload', verifyToken, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const newVideo = new Video({
      title: req.body.title || req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      uploader: req.user.id,
      status: 'pending'
    });

    await newVideo.save();
    
    res.status(201).json(newVideo);

    analyzeVideo(newVideo).then(async (result) => {
      // Update Database
      newVideo.status = result.status;
      newVideo.sensitivity = result.sensitivity;
      await newVideo.save();

      // Notify Frontend 
      const io = req.app.get('io');
      if (io) {
        io.emit('video_processed', { 
          videoId: newVideo._id, 
          status: newVideo.status,
          sensitivity: newVideo.sensitivity
        });
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Route 
router.get('/', verifyToken, async (req, res) => {
  try {
    const videos = await Video.find({ uploader: req.user.id }).sort({ uploadDate: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/stream/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.params.filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Video not found');
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(filePath, { start, end });
    
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

module.exports = router;