const jwt = require("jsonwebtoken");
const api = require("../tools/common");
const argon2 = require("argon2");

const SECRET_KEY = process.env.SECRET_KEY;
// ✅ Credential client (bisa juga dipindah ke .env)
const CLIENT_CREDENTIALS = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
};

// Generate Access Token (expired 12 jam)
const generateToken = (data) => {
  return jwt.sign(data, SECRET_KEY, { expiresIn: "12h" });
};

// Generate Refresh Token (expired 30 hari)
const generateRefreshToken = (data) => {
  return jwt.sign(data, SECRET_KEY, { expiresIn: "30d" });
};

// Verify client_id & client_secret
const verifyClient = (client_id, client_secret) => {
  return (
    client_id === CLIENT_CREDENTIALS.client_id &&
    client_secret === CLIENT_CREDENTIALS.client_secret
  );
};

// ✅ Verify Access Token
const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return api.error(res, "No Token Provided", 401);
  }

  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("JWT Verify Error:", err);
      return api.error(res, "Failed To Authenticate Token!", 403);
    }

    req.user = decoded; // simpan payload ke req.user
    next();
  });
};

const accessControl = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
};

const verifyPassword = async (plainPassword, hashPassword) => {
  try {
    return await argon2.verify(hashPassword, plainPassword);
  } catch (err) {
    console.log(err);
    return false;
  }
};

const hashPassword = async (plainPassword) => {
  try {
    return await argon2.hash(plainPassword, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 4,
      parallelism: 2,
    });
  } catch (err) {
    console.log(err);
    return "";
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken, // ✅ sudah balik ada
  accessControl,
  verifyPassword,
  hashPassword,
  verifyClient,
};
