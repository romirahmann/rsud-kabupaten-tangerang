const Minio = require("minio");
const minioConfig = require("../database/minio.config");

const minioClient = new Minio.Client({
  endPoint: minioConfig.endPoint,
  port: minioConfig.port,
  useSSL: false,
  accessKey: minioConfig.accessKey,
  secretKey: minioConfig.secretKey,
});

const bucketName = minioConfig.bucketName;

// console.log({
//   endPoint: minioConfig.endPoint,
//   port: minioConfig.port,
//   useSSL: minioConfig.useSSL,
//   accessKey: minioConfig.accessKey,
//   secretKey: minioConfig.secretKey,
//   bucketName: bucketName,
// });
// const minioClient = new Minio.Client({
//   endPoint: process.env.endPoint,
//   port: process.env.minioPort,
//   useSSL: process.env.useSSL === "false",
//   accessKey: process.env.accessKey,
//   secretKey: process.env.secretKey,
// });

// const bucketName = process.env.bucketName;

const bucketExists = async (param) => await minioClient.bucketExists(param);
const fileExist = async (filePath) =>
  await minioClient.statObject(bucketName, filePath);

const createBucket = async (newBucketName) =>
  await minioClient.makeBucket(newBucketName, "us-east-1");

// Mengupload file ke MinIO
const uploadFile = async (file) =>
  await minioClient.putObject(bucketName, file.fileName, file.fileBuffer);

// Mengunduh file dari MinIO
const downloadFile = async (fileName) =>
  await minioClient.fGetObject(bucketName, fileName);

// Menghapus file dari MinIO
const deleteFile = async (filePath) =>
  await minioClient.removeObject(bucketName, filePath);

// Memeriksa apakah file ada di MinIO
const fileExists = async (fileName) =>
  await minioClient.statObject(bucketName, fileName);

// Mendapatkan URL file
const getFileUrl = (filePath) =>
  minioClient.presignedGetObject(bucketName, filePath, 60 * 60, {
    "response-content-type": "application/pdf",
  });
const uploadFilesWithFolders = async (filePath, fileBuffer) => {
  return await minioClient.putObject(bucketName, filePath, fileBuffer);
};

module.exports = {
  createBucket,
  bucketExists,
  uploadFile,
  downloadFile,
  deleteFile,
  fileExists,
  getFileUrl,
  uploadFilesWithFolders,
  fileExist,
};
