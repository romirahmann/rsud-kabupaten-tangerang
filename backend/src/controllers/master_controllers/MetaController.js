const moment = require("moment");
const model = require("../../models/metadata.model");
const api = require("../../tools/common");

const getAllMetaData = api.catchAsync(async (req, res) => {
  const { querySearch } = req.params || "";
  let result = await model.getAll(querySearch);
  return api.success(res, result);
});

const getAllMetaDataByReq = api.catchAsync(async (req, res) => {
  let result = await model.getAllByRequest();
  return api.success(res, result);
});

const getByNorm = api.catchAsync(async (req, res) => {
  const { norm } = req.params;
  let result = await model.getByNorm(norm);
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

  return api.success(res, {
    id: result.id,
    doklin_id: result.doklin_id,
    doklin_code: result.doklin_code,
    doklin_name: result.doklin_name,
    norm: result.norm,
    title: result.title,
    file_url: result.file_url,
    description: result.description,
    created_date: result.created_date,
    created_date_string: result.created_date_string,
    service_type: result.service_type,
  });
});

const getSearchMeta = async (req, res) => {
  try {
    const { querySearch } = req.params || "";

    const data = await model.searchMetaData(querySearch);

    return api.success(res, data);
  } catch (err) {
    return api.error(res, err, 500);
  }
};

module.exports = {
  getAllMetaData,
  insertData,
  getSearchMeta,
  updateData,
  getAllMetaDataByReq,
  getByNorm,
};
