const express = require('express');
const connectDB = require('./src/config/db');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routes = require('./src/routes/routes');
require('dotenv').config();

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());

// Database Connection
connectDB();

// Use Routes
app.use('/', routes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
