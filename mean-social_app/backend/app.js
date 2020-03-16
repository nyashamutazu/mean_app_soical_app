// importing express
const express = require("express");
// importing body-parser
const bodyParser = require("body-parser");

// path packages, we can use this to find the correct relative paths... safely
const path = require('path');

//import mongoose to allow use of mongoDB metadata
const mongoose = require("mongoose");

// importing express as a function, which can be used for the app -> it is a big chest of metaware e.g. responses etc.
const app = express();

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

// running mongoose with connect, this will allow us to connect with the mongoDB database, import username and password
// Database created is chatroomDatabase
mongoose
  .connect(
    "mongodb+srv://admin-core:Admin-Central-123@database-chatroom-gvzgy.mongodb.net/chatroomDatabase?retryWrites=true"
  )
  .then(() => {
    // if successfully connected to mongoDB database
    console.log("Connected to database");
  })
  .catch(() => {
    // if unsuccessful connection to mongoDB database
    console.log("Error connecting to database");
  });

// using the imported express function -> aviods the cross-origin-resource-sharing
app.use((req, res, next) => {
  // setting a response under header, no matter the domain, it is allowed to access resources
  res.setHeader("Access-Control-Allow-Origin", "*");
  // want to also allow additional headers, it may or may not but will still be allowed
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  // we can control the words used to accept requests
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );

  // next function will move to the next metaware
  next();
});

// using bodyParser to pass json data
app.use(bodyParser.json());
// using bodyParser to pass urlencoded code
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/images', express.static(path.join('backend/images')));

// Using the post routes
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);


// exporting the app so it can be accessed by other documents
module.exports = app;
