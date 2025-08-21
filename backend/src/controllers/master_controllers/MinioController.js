const MinioModel = require("../../models/minio.model");
const api = require("../../tools/common");
const moment = require("moment");
const modelMeta = require("../../models/metadata.model");

const chunkArray = (array, size) => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, index * size + size)
  );
};

const createBucket = async (req, res) => {
  const { bucketName } = req.body;
  try {
    await MinioModel.bucketExists(bucketName);
    return api.success(res, "Bucket Already Exist");
  } catch (e) {
    try {
      let data = await MinioModel.createBucket(bucketName);
      return api.success(res, data);
    } catch (e) {
      return api.error(res, e, 500);
    }
  }
};
// Mengupload file
const uploadFile = async (req, res) => {
  const file = req.file;
  const formData = req.body;
  try {
    if (!file) {
      return api.error(res, "No file uploaded", 400);
    }

    let minioFilePath = "";
    let data = {};

    // if (formData.document_id === "1") {
    //   let documenName = "ACOUNT PAYABLE";

    //   minioFilePath =
    //     documenName +
    //     "/" +
    //     formData.nobox +
    //     "/" +
    //     formData.namaBank +
    //     "_" +
    //     formData.noCek +
    //     "_" +
    //     formData.transaksiDate +
    //     "_" +
    //     formData.nilai +
    //     "/" +
    //     file.originalname;

    //   data = {
    //     document_id: 1,
    //     nobox: formData.nobox,
    //     namaBank: formData.namaBank,
    //     noCek: formData.noCek,
    //     transaksiDate: formData.transaksiDate,
    //     nilai: formData.nilai,
    //     filename: file.originalname,
    //     filePath: minioFilePath,
    //   };
    //   await modelMeta.insertPayable(data);
    // } else {
    //   let documenName = "ACOUNT RECEIVABLE";

    //   minioFilePath =
    //     documenName +
    //     "/" +
    //     formData.nobox +
    //     "/" +
    //     formData.noReceipt +
    //     "_" +
    //     formData.receiptDate +
    //     "_" +
    //     formData.customer +
    //     "_" +
    //     formData.nominal +
    //     "/" +
    //     file.originalname;

    //   data = {
    //     document_id: 2,
    //     nobox: formData.nobox,
    //     noReceipt: formData.noReceipt,
    //     receiptDate: formData.receiptDate,
    //     customer: formData.customer,
    //     nominal: formData.nominal,
    //     filename: file.originalname,
    //     filePath: minioFilePath,
    //   };
    //   await modelMeta.insertReceivable(data);
    // }

    // let minioFile = {
    //   fileName: minioFilePath,
    //   fileBuffer: file.buffer,
    // };

    // let result = MinioModel.uploadFile(minioFile);
    // return api.success(res, result);
  } catch (err) {
    // console.error("Error uploading file:", err);
    return api.error(res, err, 500);
  }
};

const uploadFolder = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Tidak ada file yang diunggah." });
    }

    console.log("📂 Folder sedang di upload!");
    console.log("req.files length:", req.files?.length);
    console.log("req.body.paths (raw):", req.body.paths);

    let paths;
    try {
      paths = JSON.parse(req.body.paths);
    } catch (e) {
      return res.status(400).json({ error: "Format paths tidak valid." });
    }

    if (!Array.isArray(paths) || paths.length !== req.files.length) {
      return res.status(400).json({
        error: "Paths tidak valid atau tidak cocok dengan jumlah file.",
      });
    }

    const files = req.files
      .map((file, index) => ({
        buffer: file.buffer,
        originalname: file.originalname,
        // Normalisasi path biar konsisten di MinIO
        relativePath: (paths[index] || file.originalname).replace(/\\/g, "/"),
      }))
      .filter((file) => file.originalname.toLowerCase() !== "thumbs.db");

    console.log("files after map/filter:", files.length);

    const batchSize = 50;
    const fileBatches = chunkArray(files, batchSize);

    console.log("fileBatches count:", fileBatches.length);

    let successCount = 0;
    let failedCount = 0;

    for (const [batchIndex, batch] of fileBatches.entries()) {
      console.log(
        `🚀 Processing batch ${batchIndex + 1}/${fileBatches.length}, size: ${
          batch.length
        }`
      );

      const results = await Promise.allSettled(
        batch.map(async (file) => {
          try {
            console.log(
              "➡️ Processing file:",
              file.originalname,
              "path:",
              file.relativePath
            );

            if (!file.relativePath) {
              console.warn("⚠️ File tanpa relativePath:", file.originalname);
              return;
            }

            // Simpan ke DB
            await insertDatabase(file.relativePath);

            // Upload ke MinIO
            await MinioModel.uploadFilesWithFolders(
              file.relativePath,
              file.buffer
            );

            return true;
          } catch (error) {
            console.error(
              "❌ Error saat proses file:",
              file.originalname,
              error
            );
            throw error;
          }
        })
      );

      successCount += results.filter((r) => r.status === "fulfilled").length;
      failedCount += results.filter((r) => r.status === "rejected").length;
    }

    return api.success(res, {
      message: "UPLOAD COMPLETED",
      total: files.length,
      success: successCount,
      failed: failedCount,
    });
  } catch (error) {
    console.error("❌ Terjadi kesalahan dalam uploadFolder:", error);
    return api.error(res, error, 500);
  }
};

// Mengunduh file dari MinIO
const downloadFile = async (req, res) => {
  const { fileName } = req.params; // Ambil file name dari parameter URL

  if (!fileName) {
    return api.error(res, "File name is required", 400);
  }

  try {
    let data = await MinioModel.downloadFile(fileName);
    return api.success(res, data);
  } catch (err) {
    console.error("Error downloading file:", err);
    return api.error(res, err, 500);
  }
};

// Menghapus file dari MinIO
const deleteFile = async (req, res) => {
  const { filePath, accountName, dataId } = req.body;

  if (!filePath) {
    return api.error(res, "File path is required", 400);
  }

  try {
    const fileExist = await MinioModel.fileExist(filePath);
    if (fileExist) {
      // DELETE META DATA
      if (accountName === "ACOUNT PAYABLE") {
        modelMeta.delAP(dataId);
      } else {
        modelMeta.delAR(dataId);
      }
      // DELETE FILE DI MINIO
      const data = await MinioModel.deleteFile(filePath);
      return api.success(res, data);
    } else {
      return api.error(res, "File tidak ditemukan", 404);
    }
  } catch (err) {
    console.error("Error deleting file:", err);
    return api.error(res, err, 500);
  }
};

// Memeriksa apakah file ada di MinIO
const checkFileExists = async (req, res) => {
  const { fileName } = req.params;

  if (!fileName) {
    return api.error(res, "File name is required", 400);
  }

  try {
    const exists = await MinioModel.fileExists(fileName);
    if (exists) {
      return api.success(res, "File exists");
    } else {
      return api.error(res, "File not found", 404);
    }
  } catch (err) {
    return api.error(res, err, 500);
  }
};

// Mendapatkan URL presigned untuk file
const getFileUrl = async (req, res) => {
  try {
    const { filePath } = req.query;
    console.log(filePath);

    if (!filePath) {
      return api.error(res, "File Path is required", 400);
    }

    const url = await MinioModel.getFileUrl(filePath);

    return api.success(res, url);
  } catch (err) {
    return api.error(res, `Failed to generate presigned URL: ${err}`, 500);
  }
};

const insertDatabase = async (filepath) => {
  if (!filepath) {
    return false;
  }

  const parts = filepath.split("/");

  if (parts.length < 6) {
    return false;
  }
  let partDataDiri = parts[1].split("_");

  let tanggalScan = moment(parts[0], "YYYYMMDD").format("YYYY-MM-DD");
  let noMr = partDataDiri[0];
  let namaPasien = partDataDiri[1];
  let tglLahir = moment(partDataDiri[2], "DDMMYYYY").format("YYYY-MM-DD");
  let jenisDokumen = parts[2];
  let kategori = parts[3];
  let layanan = parts[4];
  let filename = parts[5];
  let filePath = filepath;

  let data = {
    tanggalScan,
    noMr,
    namaPasien,
    tglLahir,
    jenisDokumen,
    kategori,
    layanan,
    filename,
    filePath,
  };

  await modelMeta.insert(data);
};

module.exports = {
  uploadFile,
  uploadFolder,
  downloadFile,
  deleteFile,
  checkFileExists,
  getFileUrl,
  createBucket,
};
