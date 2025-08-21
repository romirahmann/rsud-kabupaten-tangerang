const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { init } = require("./services/socket.service");
const mainRoute = require("./routes/routes");
const app = express();
const server = createServer(app);
const io = init(server);

app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    service: "WEB SERVICE RSUD KABUPATEN TANGGERANG IS RUNNING!",
  });
});

app.use("/api", mainRoute);

module.exports = { app, server };
