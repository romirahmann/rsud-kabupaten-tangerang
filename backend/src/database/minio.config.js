require("dotenv").config();

module.exports = {
  endPoint: process.env.ENDPOINT,
  port: parseInt(process.env.MINIOPORT, 10),
  useSSL: process.env.USESSL === "true",
  accessKey: process.env.ACCESSKEY,
  secretKey: process.env.SECRETKEY,
  bucketName: process.env.BUCKETNAME,
};
