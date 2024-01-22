/*
 * @file: index.js
 * @description: It Contain environment variables.
 * @date: 18.04.2023
 * @author: Ankit Kumar Gautam
 */

//For local setup

const local = {
  apiUrl: "http://localhost:",
  PORT: "6163/api",
  socketUrl: "http://localhost:7011",
  socketUrlBackend: "http://localhost:6163",
};

//For dev server

// // const baseURL = "http://54.201.160.69:3288/api/v1"


const staging = {
  apiUrl: "http://54.201.160.69:",
  PORT: "3288/api/v1",
  socketUrl: "http://54.201.160.69:3288",
  socketUrlBackend: "http://54.201.160.69:3288",
};

if (process.env.REACT_APP_ENV === "staging") module.exports = staging;

// if (process.env.REACT_APP_ENV === "local") module.exports = local;
// else if (process.env.REACT_APP_ENV === "dev") module.exports = dev;
// else if (process.env.REACT_APP_ENV === "staging") module.exports = staging;
// else module.exports = dev;
