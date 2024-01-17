const express = require('express');
const connectDB = require('./src/config/db');
const bodyParser = require('body-parser');
const routes = require('./src/routes/routes');
const requestLogger = require('./src/config/logger')
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(requestLogger);

// Database Connection
connectDB();

// Use Routes
app.use('/', routes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
