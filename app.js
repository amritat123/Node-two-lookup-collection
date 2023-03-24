// main entry file for start the server
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path')

const db = require("./src/database/db");
const UserRoute = require("../api/src/route/user-route");
const addRoute = require('./src/route/address-route');

const app = express();

// -------------------saving data into json format in body---------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use multer route
// express path.....
app.use("/uploads", express.static("uploads"));

app.use("", UserRoute);


app.use("", addRoute);
// server running on port 3000
const port = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`server started on port ${port}!`), db);