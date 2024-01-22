/*
 * @file: index.js
 * @description: It Contain environment variables.
 * @date: 18.04.2023
 * @author: Ankit Kumar Gautam
 */

//Install express server
const express = require("express");
//import express from "express";
const app = express();
const path = require("path");
const port = 3289;

// Serve only the static files form the build directory
app.use(express.static(__dirname + "/build"));

const http = require("http");

app.get("/*", function (req, res) {
  return res.sendFile(path.join(__dirname + "/build", "index.html"));
});

const server = http.createServer(app);

try {
  // Start the app by listening on the default Heroku port
  server.listen(port, (err, succ) => {
    if (err) {
      console.log("Error : ", err);
    } else {
      console.log("Express server listening on port " + port);
    }
  });
} catch (error) {
  console.log("error => ", error);
}
