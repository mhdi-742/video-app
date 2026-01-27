const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  filename: { type: String, required: true },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'processed', 'flagged', 'safe'], 
    default: 'pending' 
  },
  sensitivity: { type: String, default: 'unchecked' },
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);