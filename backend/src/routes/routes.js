var express = require("express");
var router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const path = require("path");
const { verifyToken, accessControl } = require("../services/auth.service");
const upload = multer({ storage }).single("file");
const uploadFolders = multer({ storage }).array("files");

const authRoutes = require("../routes/utility_routes/auth.routes");
const masterRoutes = require("../routes/master_routes/master.routes");
const MinioController = require("../controllers/master_controllers/MinioController");
const documentRoutes = require("../routes/master_routes/document.routes");
const LicenseController = require("../controllers/master_controllers/LicenseController");

router.use("/oauth", authRoutes);
router.use("/master", masterRoutes);
router.use(
  "/document/v1/alih-media",
  accessControl,
  verifyToken,
  documentRoutes
);

// Upload routes
router.post("/upload-file", upload, MinioController.uploadFile);
router.post("/upload-folder", uploadFolders, MinioController.uploadFolder);

// LICENSE
router.post("/generate-license", LicenseController.generateLicense);
router.get("/generate-code", LicenseController.getFingerprint);
router.get("/validate-license", LicenseController.validateLicense);
router.post("/activation", LicenseController.activation);

module.exports = router;
