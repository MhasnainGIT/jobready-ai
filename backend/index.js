const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const paymentRoutes = require('./routes/payments');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Check for required environment variables
const requiredEnvVars = ['OPENAI_API_KEY', 'JWT_SECRET', 'MONGO_URI'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  console.error('Please set these environment variables in your deployment platform.');
}

app.use(express.json());
app.use(cors({
  origin: '*', // Allow all origins for now
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {   
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.send('JobReady AI Backend is running!');
});

// Test endpoint to check configuration
app.get('/api/test', (req, res) => {
    const config = {
        openaiConfigured: !!process.env.OPENAI_API_KEY,
        jwtConfigured: !!process.env.JWT_SECRET,
        mongoConfigured: !!process.env.MONGO_URI,
        nodeEnv: process.env.NODE_ENV || 'development'
    };
    
    res.json({
        message: 'Server is running',
        config,
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api/payments', paymentRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 