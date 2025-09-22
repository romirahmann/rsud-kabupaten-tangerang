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
    console.log(formData);
    // Pastikan semua string jadi uppercase
    const norm = formData.norm ? formData.norm.toUpperCase() : "";
    const noBox = formData.noBox ? formData.noBox : "";
    const namaPasien = formData.namaPasien
      ? formData.namaPasien.toUpperCase()
      : "";
    const jenisDokumen = formData.jenisDokumen
      ? formData.jenisDokumen.toUpperCase()
      : "";
    const kategori = formData.kategori ? formData.kategori.toUpperCase() : "";
    const layanan = formData.layanan ? formData.layanan.toUpperCase() : "";
    const title = file.originalname.toUpperCase();

    // Buat path file di Minio (misalnya: tanggalScan/norm_namaPasien_tglLahir/jenisDokumen/kategori/layanan/fileName)
    const minioFilePath = `${moment(formData.tanggalScan).format(
      "YYYYMMDD"
    )}/${noBox}/${norm}_${namaPasien}_${moment(formData.tglLahir).format(
      "DDMMYYYY"
    )}/${jenisDokumen}/${kategori}/${layanan}/${title}`;

    // Data yang mau disimpan ke DB
    const data = {
      tanggalScan: formData.tanggalScan, // tetap format tanggal asli
      noBox,
      norm,
      namaPasien,
      tglLahir: formData.tglLahir, // tetap format tanggal asli
      jenisDokumen,
      kategori,
      doklin_code: kategori,
      layanan,
      title,
      file_url: minioFilePath,
    };

    // Upload file ke MinIO
    const minioFile = {
      fileName: minioFilePath,
      fileBuffer: file.buffer,
    };

    // console.log("➡️ File Path di MinIO:", minioFilePath);

    await MinioModel.uploadFile(minioFile);
    await modelMeta.insert(data);

    return api.success(res, { message: "File uploaded", data });
  } catch (err) {
    console.error("Error uploading file:", err);
    return api.error(res, err, 500);
  }
};

const uploadFileAPI = async (req, res) => {
  const file = req.file;
  const formData = req.body;
  // console.log(file, formData);

  try {
    if (!file) {
      return api.error(res, "No file uploaded", 400);
    }

    // Pastikan semua string jadi uppercase
    const norm = formData.norm ? formData.norm.toUpperCase() : "";
    const doklin_code = formData.doklin_code
      ? formData.doklin_code.toUpperCase()
      : "";
    const title = file.originalname;
    const description = formData.description;

    // Buat path file di Minio (misalnya: tanggalScan/norm_namaPasien_tglLahir/jenisDokumen/kategori/layanan/fileName)
    const minioFilePath = `API/${norm}/${doklin_code}/${title}`;

    // Data yang mau disimpan ke DB
    const data = {
      norm,
      doklin_code,
      title,
      description,
      file_url: minioFilePath,
    };

    // Upload file ke MinIO
    const minioFile = {
      fileName: minioFilePath,
      fileBuffer: file.buffer,
    };

    // console.log("➡️ File Path di MinIO:", minioFilePath);
    await modelMeta.insert(data);
    await MinioModel.uploadFile(minioFile);

    return api.success(res, { message: "File uploaded", data });
  } catch (err) {
    console.error("Error uploading file:", err);
    return api.error(res, err, 500);
  }
};

const uploadFolder = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Tidak ada file yang diunggah." });
    }

    console.log("📂 Folder sedang di upload!");

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
        relativePath: (paths[index] || file.originalname).replace(/\\/g, "/"),
      }))
      .filter((file) => file.originalname.toLowerCase() !== "thumbs.db");

    console.log("files after map/filter:", files.length);

    const batchSize = 50;
    const fileBatches = chunkArray(files, batchSize);

    console.log("fileBatches count:", fileBatches.length);

    let successCount = 0;
    let failedCount = 0;
    let skippedCount = 0;

    for (const [batchIndex, batch] of fileBatches.entries()) {
      console.log(
        `🚀 Processing batch ${batchIndex + 1}/${fileBatches.length}, size: ${
          batch.length
        }`
      );

      const results = await Promise.allSettled(
        batch.map(async (file) => {
          try {
            // console.log(
            //   "➡️ Processing file:",
            //   file.originalname,
            //   "path:",
            //   file.relativePath
            // );

            if (!file.relativePath) {
              console.warn("⚠️ File tanpa relativePath:", file.originalname);
              return;
            }

            // 🔎 Cek dulu apakah metadata sudah ada di DB
            const alreadyExists = await modelMeta.checkDatabase(
              file.relativePath
            );
            if (alreadyExists) {
              // console.log(`⏭️ Skip file (sudah ada): ${file.relativePath}`);
              skippedCount++;
              return "skipped";
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

      successCount += results.filter((r) => r.value === true).length;
      failedCount += results.filter((r) => r.status === "rejected").length;
      // skippedCount sudah ditambah di atas
    }

    return api.success(res, {
      message: "UPLOAD COMPLETED",
      total: files.length,
      success: successCount,
      skipped: skippedCount,
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
  const { id, path } = req.query;
  console.log(id, path);
  if (!path) {
    return api.error(res, "File path is required", 400);
  }

  try {
    const fileExist = await MinioModel.fileExist(path);
    if (fileExist) {
      await modelMeta.remove(id);
      await MinioModel.deleteFile(path);
      return api.success(res, "Deleted Successfully!");
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
  console.log(parts);
  if (parts.length < 6) {
    return false;
  }
  let partDataDiri = parts[2].split("_");
  let fullFileName = parts[6].split("_");

  let tanggalScan = moment(parts[0], "YYYYMMDD").format("YYYY-MM-DD");
  let nobox = parts[1];
  let norm = partDataDiri[0];
  let namaPasien = partDataDiri[1];
  let tglLahir = moment(partDataDiri[2], "DDMMYYYY").format("YYYY-MM-DD");
  let jenisDokumen = parts[3];
  let doklin_code = parts[4];
  let layanan = parts[5];
  let tanggalKunjungan = fullFileName[0];
  let title = fullFileName[1];
  let file_url = filepath;

  let data = {
    tanggalScan,
    nobox,
    norm,
    namaPasien,
    tglLahir,
    jenisDokumen,
    doklin_code,
    layanan,
    tanggalKunjungan,
    title,
    file_url,
  };

  await modelMeta.insert(data);
};

const deleteFileAPI = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return api.error(res, "ID Required!", 500);
    }

    let result = await modelMeta.getByID(id);
    await modelMeta.remove(id);
    await MinioModel.deleteFile(result.file_url);
    return api.success(res, "Deleted Successfully!");
  } catch (error) {
    console.log(error);
    return api.error(res, "Deleted Failed!", 500);
  }
};

const updateFileAPI = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    if (!id) {
      return api.error(res, "ID Not Found!", 401);
    }

    let result = await modelMeta.update(id, data);
    return api.success(res, result);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  uploadFile,
  uploadFolder,
  downloadFile,
  deleteFile,
  checkFileExists,
  getFileUrl,
  createBucket,
  uploadFileAPI,
  deleteFileAPI,
  updateFileAPI,
};
