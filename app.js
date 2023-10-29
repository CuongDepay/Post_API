const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const feedRoutes = require("./routes/feed");
const authRoutes = require('./routes/auth');

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4());
  },
});


// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form></form>
app.use(bodyParser.json()); // application/json
app.use(multer({ storage: storage}).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    "mongodb+srv://cuongdepay:L0IItcH4kKEaO2eN@cluster0.z1uppdh.mongodb.net/messages"
  )
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
