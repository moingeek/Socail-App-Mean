const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const path = require('path');



const app = express();

mongoose.connect("mongodb+srv://Moin:w7UGeEb88uIDxzBx@mean-ph5mu.mongodb.net/mean?retryWrites=true")
.then(()=>{
  console.log('Connected To Database!');
}).catch(()=>{
  console.log('Connection failed');
});


app.use(bodyParser.json());
app.use("/images", express.static(path.join("backend/images")));
app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accpet, Authorization"
);
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.use("/api/posts",postsRoutes);
app.use("/api/user",userRoutes);


module.exports = app;
