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
const updateData = api.catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  let result = await model.update(id, data);
  return api.success(res, { message: "Add Successfully", result });
});

const getSearchMeta = async (req, res) => {
  try {
    const search = req.query.search || "";

    const data = await model.searchMetaData(search);

    return api.success(res, data);
  } catch (err) {
    return api.error(res, err, 500);
  }
};

module.exports = { getAllMetaData, insertData, getSearchMeta, updateData };
