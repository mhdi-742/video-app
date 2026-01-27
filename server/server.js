require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app); 

// Middleware
app.use(cors());
app.use(express.json()); 

// Socket.io Setup 
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
});

// Make "io" accessible in routes
app.set('io', io);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB Connected Successfully'))
  .catch(err => console.error(' MongoDB Error:', err));

app.get('/', (req, res) => {
  res.send('Video Streaming API is Running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));