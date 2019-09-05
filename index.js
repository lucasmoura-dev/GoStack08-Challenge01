const express = require("express");

const server = express();
server.listen(3000);

server.get("/test", (req, res) => {
  return res.send("Hello World");
});
