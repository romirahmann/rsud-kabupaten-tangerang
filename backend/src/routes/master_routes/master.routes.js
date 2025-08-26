var express = require("express");
var router = express.Router();

const UserController = require("../../controllers/master_controllers/UserController");
const MinioController = require("../../controllers/master_controllers/MinioController");
const MetaController = require("../../controllers/master_controllers/MetaController");

// USER
router.post("/user", UserController.register);
router.get("/users", UserController.getAllUsers);
router.get("/user/:id", UserController.getUserById);
router.put("/user/:id", UserController.updateUser);
router.delete("/user/:id", UserController.deleteUser);
// File
router.get("/file/:filename", MinioController.checkFileExists);
router.delete("/delete-file/", MinioController.deleteFile);
router.get("/file-url", MinioController.getFileUrl);
router.get("/cek-file/:filename", MinioController.checkFileExists);
router.post("/create-bucket", MinioController.createBucket);

// META
router.get("/documents", MetaController.getAllMetaData);
router.put("/document/:id", MetaController.updateData);
router.get("/document-search", MetaController.getSearchMeta);

module.exports = router;
