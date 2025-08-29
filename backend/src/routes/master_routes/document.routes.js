var express = require("express");
var router = express.Router();

const DoklinController = require("../../controllers/master_controllers/DoklinController");

// DOKLIN
router.get("/master-doklin", DoklinController.getAllDoklin);
router.post("/doklin", DoklinController.insertDoklin);

//

module.exports = router;
