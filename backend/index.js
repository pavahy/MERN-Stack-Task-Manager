require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ CORS Configuration — handles origin + preflight properly
const allowedOrigins = [
  'https://mern-stack-task-manager-1-co4o.onrender.com',
  'http://localhost:3000' // add this if developing locally
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


// ✅ Enable preflight requests for all routes
app.options('*', cors());

// Middleware
app.use(express.json());

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Routes
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
