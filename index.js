const express = require('express');
const connectDB = require('./src/config/db');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routes = require('./src/routes/routes');
const requestLogger = require('./src/config/logger')
const cors = require('cors');
require('dotenv').config();
const saveDummyProducts = require('./src/dummy');

const app = express();

app.use(cors({
  origin: "*",
}))

// Middleware
app.use(bodyParser.json());
app.use(requestLogger);
app.use(cookieParser());

// Database Connection
connectDB();

// saveDummyProducts();

// Use Routes
app.use('/', routes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


