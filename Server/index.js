const express = require('express');
const db = require('./db/config')
const route = require('./controllers/route');
const bodyParser = require('body-parser');
const cors = require('cors');


const port = process.env.PORT || 5001
require('dotenv').config()

const fs = require('fs');
const path = require('path');

// Global variable to track MongoDB connection status
global.isMongoConnected = false;

//Setup Express App
const app = express();
// Middleware
app.use(bodyParser.json());
// Set up CORS  
app.use(cors())

// Root endpoint to check server status
app.get('/', async (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running',
        mongoConnected: global.isMongoConnected
    });
});

//API Routes
app.use('/api', route);

// Get port from environment and store in Express.
const server = app.listen(port, () => {
    const protocol = (process.env.HTTPS === true || process.env.NODE_ENV === 'production') ? 'https' : 'http';
    const { address, port } = server.address();
    const host = address === '::' ? '127.0.0.1' : address;
    console.log(`Server listening at ${protocol}://${host}:${port}/`);
});

// Connect to MongoDB
const DATABASE_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017'
const DATABASE = process.env.DB || 'Prolink'

// Attempt to connect to MongoDB but continue even if connection fails
db(DATABASE_URL, DATABASE)
    .then(() => {
        global.isMongoConnected = true;
        console.log('MongoDB connected successfully');
    })
    .catch(err => {
        global.isMongoConnected = false;
        console.error('MongoDB connection failed:', err.message);
        console.log('Server will continue with limited functionality');
    });
