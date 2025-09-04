const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { init } = require("./services/socket.service");
const mainRoute = require("./routes/routes");
const path = require("path");

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

// 🔹 API routes
app.use("/", mainRoute);

// 🔹 Tentukan path frontend
let frontendPath;
if (process.pkg) {
  // kalau jalan dari exe → ambil relative ke folder exe
  frontendPath = path.join(path.dirname(process.execPath), "frontend");
} else {
  // kalau jalan via node normal → ambil dari source
  frontendPath = path.join(__dirname, "../frontend");
}
console.log("Serving frontend from:", frontendPath);

// 🔹 Serve file statis
app.use("/rsud-tangerang", express.static(frontendPath));

// 🔹 Fallback ke index.html
app.get("/rsud-tangerang/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

module.exports = { app, server };
