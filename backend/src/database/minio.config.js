require("dotenv").config();

module.exports = {
  endPoint: process.env.endPoint,
  port: parseInt(process.env.minioPort, 10), // string → int
  useSSL: process.env.useSSL === "true", // string → boolean
  accessKey: process.env.accessKey,
  secretKey: process.env.secretKey,
  bucketName: process.env.bucketName,
};
