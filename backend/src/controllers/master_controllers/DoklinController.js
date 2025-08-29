const moment = require("moment");
const model = require("../../models/doklin.model");
const api = require("../../tools/common");

const getAllDoklin = api.catchAsync(async (req, res) => {
  let data = await model.getAll();
  return api.success(res, data);
});

const insertDoklin = api.catchAsync(async (req, res) => {
  const data = req.body;

  let result = await model.insert(data);
  return api.success(res, result);
});

module.exports = { getAllDoklin, insertDoklin };
