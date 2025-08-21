const jwt = require("jsonwebtoken");
const api = require("../tools/common");
const argon2 = require("argon2");

const SECRET_KEY = process.env.SECRET_KEY;

const generateToken = (data) => {
  return jwt.sign(data, SECRET_KEY, { expiresIn: "12h" });
};

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
      console.log(err);
      return api.error(res, "Failed To Authentication Token!", 403);
    }

    req.user = decoded;
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

const hashPasword = async (plainPassword) => {
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
  verifyToken,
  accessControl,
  verifyPassword,
  hashPasword,
};
