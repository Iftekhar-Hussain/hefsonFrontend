import io from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';
// const URL = "http://localhost:3288";

// const URL = "http://3.140.54.7:3288";
const URL = "https://hefson.app";

console.log("Socket initialize");

// const URL = "http://54.201.160.69:3288";

export const socket = io(URL);
