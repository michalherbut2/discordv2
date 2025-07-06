const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// In-memory storage (replace with database in production)
const users = new Map();
const channels = new Map();
const messages = new Map();

// Default channels
const defaultChannels = [
  { id: 'general', name: 'general', description: 'General discussion' },
  { id: 'random', name: 'random', description: 'Random chat' },
  { id: 'tech', name: 'tech', description: 'Tech discussions' }
];

defaultChannels.forEach(channel => {
  channels.set(channel.id, channel);
  messages.set(channel.id, []);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining
  socket.on('join', (userData) => {
    const user = {
      id: socket.id,
      username: userData.username || `User${Math.floor(Math.random() * 1000)}`,
      avatar: userData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${userData.username}`,
      status: 'online',
      joinedAt: new Date()
    };

    users.set(socket.id, user);
    
    // Send initial data to user
    socket.emit('user-data', user);
    socket.emit('channels-list', Array.from(channels.values()));
    
    // Broadcast user joined to all clients
    socket.broadcast.emit('user-joined', user);
    
    // Send updated users list
    io.emit('users-list', Array.from(users.values()));
  });

  // Handle joining a channel
  socket.on('join-channel', (channelId) => {
    const user = users.get(socket.id);
    if (user && channels.has(channelId)) {
      socket.join(channelId);
      user.currentChannel = channelId;
      
      // Send channel messages to user
      const channelMessages = messages.get(channelId) || [];
      socket.emit('channel-messages', {
        channelId,
        messages: channelMessages.slice(-50) // Send last 50 messages
      });
      
      // Notify channel about user joining
      socket.to(channelId).emit('user-joined-channel', {
        user: user.username,
        channelId
      });
    }
  });

  // Handle sending messages
  socket.on('send-message', (data) => {
    const user = users.get(socket.id);
    if (user && data.channelId && channels.has(data.channelId)) {
      const message = {
        id: uuidv4(),
        userId: user.id,
        username: user.username,
        avatar: user.avatar,
        content: data.content,
        timestamp: new Date(),
        channelId: data.channelId,
        type: data.type || 'text'
      };

      // Store message
      if (!messages.has(data.channelId)) {
        messages.set(data.channelId, []);
      }
      messages.get(data.channelId).push(message);

      // Broadcast message to channel
      io.to(data.channelId).emit('new-message', message);
    }
  });

  // Handle creating new channel
  socket.on('create-channel', (channelData) => {
    const user = users.get(socket.id);
    if (user && channelData.name) {
      const channel = {
        id: uuidv4(),
        name: channelData.name.toLowerCase().replace(/\s+/g, '-'),
        description: channelData.description || '',
        createdBy: user.username,
        createdAt: new Date()
      };

      channels.set(channel.id, channel);
      messages.set(channel.id, []);

      // Broadcast new channel to all users
      io.emit('new-channel', channel);
    }
  });

  // Handle typing indicators
  socket.on('typing-start', (data) => {
    const user = users.get(socket.id);
    if (user) {
      socket.to(data.channelId).emit('user-typing', {
        userId: user.id,
        username: user.username,
        channelId: data.channelId
      });
    }
  });

  socket.on('typing-stop', (data) => {
    const user = users.get(socket.id);
    if (user) {
      socket.to(data.channelId).emit('user-stopped-typing', {
        userId: user.id,
        channelId: data.channelId
      });
    }
  });

  // Handle user status changes
  socket.on('status-change', (status) => {
    const user = users.get(socket.id);
    if (user) {
      user.status = status;
      io.emit('user-status-update', {
        userId: user.id,
        status: status
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const user = users.get(socket.id);
    
    if (user) {
      // Broadcast user left
      socket.broadcast.emit('user-left', user);
      
      // Remove user
      users.delete(socket.id);
      
      // Send updated users list
      io.emit('users-list', Array.from(users.values()));
    }
  });
});

// API endpoints
app.get('/api/channels', (req, res) => {
  res.json(Array.from(channels.values()));
});

app.get('/api/channels/:id/messages', (req, res) => {
  const channelId = req.params.id;
  const channelMessages = messages.get(channelId) || [];
  res.json(channelMessages.slice(-100)); // Return last 100 messages
});

app.get('/api/users', (req, res) => {
  res.json(Array.from(users.values()));
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Discord v2 server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to use the app`);
});