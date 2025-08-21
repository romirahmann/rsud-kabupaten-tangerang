const moment = require("moment");
const model = require("../../models/metadata.model");
const api = require("../../tools/common");

const getAllMetaData = api.catchAsync(async (req, res) => {
  const { querySearch } = req.params || "";
  let result = await model.getAll(querySearch);
  return api.success(res, result);
});

const insertData = api.catchAsync(async (req, res) => {
  const data = req.body;
  let result = await model.insert(data);
  return api.success(res, { message: "Add Successfully", result });
});

const insertFromMinio = api.catchAsync(async (filePath) => {
  console.log(filePath);
});

module.exports = { getAllMetaData, insertData };
