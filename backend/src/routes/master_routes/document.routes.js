var express = require("express");
var router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();

const upload = multer({ storage }).single("file");
const DoklinController = require("../../controllers/master_controllers/DoklinController");
const MetaController = require("../../controllers/master_controllers/MetaController");
const MinioController = require("../../controllers/master_controllers/MinioController");

// DOKLIN
router.get("/master-doklin", DoklinController.getAllDoklin);
router.post("/doklin", DoklinController.insertDoklin);

//DOKUMEN
router.get("/norms", MetaController.getAllMetaDataByReq);
router.get("/norm/:norm", MetaController.getByNorm);
router.post("/", upload, MinioController.uploadFileAPI);
router.put("/:id", MinioController.updateFileAPI);
router.delete("/:id", MinioController.deleteFileAPI);
module.exports = router;
