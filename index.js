const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const initDb = require("./InitDB");
const bodyParser = require("body-parser");
const userRouter = require("./Routes/UserRoute");
const generalRouter = require('./Routes/GeneralRouter');
require("dotenv").config();
const app = express();
app.use(bodyParser.json({ limit: "50mb" })); // increase payload limit
const allowedOrigins = [
   "http://localhost:3000", 
  "http://localhost:3001", 
  "http://localhost:5000",
];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));
app.use(process.env.BASE_URI, userRouter);
app.use(process.env.BASE_URI, generalRouter);
app.listen(process.env.PORT, () => console.log('Server running on http://localhost:5000'));
