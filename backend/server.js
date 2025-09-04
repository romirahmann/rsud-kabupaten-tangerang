// Load .env
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

// Kalau jalan dari exe → cari .env di folder exe
// Kalau jalan dari source → cari .env di ./env/.env
if (process.pkg) {
  const envPath = path.join(path.dirname(process.execPath), ".env");
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else {
    console.warn("⚠️  .env tidak ditemukan di folder exe!");
  }
} else {
  dotenv.config({ path: path.join(__dirname, "env/.env") });
}

const { server } = require("./src/app");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 3091;

server.listen(PORT, HOST, () => {
  console.log(`✅ Server running on http://${HOST}:${PORT}`);
});
