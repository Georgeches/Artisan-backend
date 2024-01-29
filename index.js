const express = require('express');
const connectDB = require('./src/config/db');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const routes = require('./src/routes/routes');
const requestLogger = require('./src/config/logger');
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

app.use(session({
  secret: process.env.SESSION_SECRET || "5e282b23cfb271873a242bade5359389",
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 14 * 24 * 60 * 60, // 14 days
  }),
  cookie: {
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
  },
}));


app.use('/', routes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
