const db = require("./../database/db.config");

const getAll = async (querySearch) => {
  let query = db
    .select(
      "m.id",
      "m.tanggalScan",
      "m.noMr as norm",
      "m.namaPasien",
      "m.tglLahir",
      "m.jenisDokumen",
      "m.kategori",
      "m.layanan",
      "m.title",
      "m.filePath as file_url",
      "m.doklin_code",
      "m.created_date",
      "m.created_date_string",
      "d.name as doklin_name",
      "d.id as doklin_id"
    )
    .from("meta_data as m")
    .join("doklin as d", "d.code", "m.doklin_code");
  return await query;
};

const getByID = async (id) =>
  await db.select("filePath").where("id", id).from("meta_data").first();

const getAllByRequest = async () =>
  await db
    .select(
      "m.noMr as norm",
      "m.title",
      "m.filePath as file_url",
      "m.doklin_code",
      "m.created_date",
      "m.created_date_string",
      "m.description",
      "d.name as doklin_name",
      "d.id as doklin_id"
    )
    .from("meta_data as m")
    .join("doklin as d", "d.code", "m.doklin_code");

const getByNorm = async (norm) => {
  let query = db
    .select(
      "m.noMr as norm",
      "m.title",
      "m.filePath as file_url",
      "m.doklin_code",
      "m.created_date",
      "m.created_date_string",
      "m.description",
      "d.name as doklin_name",
      "d.id as doklin_id"
    )
    .from("meta_data as m")
    .join("doklin as d", "d.code", "m.doklin_code");

  if (norm) {
    query.where("m.noMr", "like", `%${norm}%`);
  }

  const result = await query;
  return result;
};

const searchMetaData = async (querySearch) => {
  let query = db("meta_data").select("*");

  if (querySearch) {
    query.whereRaw(
      `MATCH(noMr, namaPasien, jenisDokumen, layanan, filename, kategori)
       AGAINST(? IN BOOLEAN MODE)`,
      [`${querySearch}*`]
    );
  }

  return await query;
};

const insert = async (data) => await db("meta_data").insert(data);
const update = async (id, data) =>
  await db("meta_data").where("id", id).update(data);
const remove = async (id) => await db("meta_data").where("id", id).delete();

const checkDatabase = async (relativePath) => {
  const result = await db("meta_data")
    .where("filePath", relativePath)
    .count({ count: "*" });

  return Number(result[0].count) > 0;
};

module.exports = {
  getAll,
  insert,
  checkDatabase,
  searchMetaData,
  remove,
  update,
  getAllByRequest,
  getByNorm,
  getByID,
};
