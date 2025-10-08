const db = require("./../database/db.config");

const getAll = async (querySearch) => {
  let query = db
    .select(
      "m.id",
      "m.tanggalScan",
      "m.norm",
      "m.noBox",
      "m.namaPasien",
      "m.tglLahir",
      "m.jenisDokumen",
      "m.kategori",
      "m.layanan",
      "m.title",
      "m.file_url",
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

const getDataByID = async (id) =>
  await db
    .select(
      "m.id",
      "m.tanggalScan",
      "m.norm",
      "m.noBox",
      "m.namaPasien",
      "m.tglLahir",
      "m.jenisDokumen",
      "m.kategori",
      "m.layanan",
      "m.title",
      "m.file_url",
      "m.doklin_code",
      "m.created_date",
      "m.created_date_string",
      "m.layanan as service_type",
      "m.description",
      "d.name as doklin_name",
      "d.id as doklin_id"
    )
    .from("meta_data as m")
    .join("doklin as d", "d.code", "m.doklin_code")
    .where("m.id", id)
    .first();

const getByID = async (id) =>
  await db.select("file_url").where("id", id).from("meta_data").first();

const getAllByRequest = async () =>
  await db
    .select(
      "m.norm",
      "m.title",
      "m.file_url",
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
      "m.id",
      "m.norm",
      "m.title",
      "m.file_url",
      "m.doklin_code",
      "m.created_date",
      "m.created_date_string",
      "m.description",
      "m.layanan as service_type",
      "d.name as doklin_name",
      "d.id as doklin_id"
    )
    .from("meta_data as m")
    .join("doklin as d", "d.code", "m.doklin_code");

  if (norm) {
    query.where("m.norm", "like", `%${norm}%`);
  }

  const result = await query;
  return result;
};

const searchMetaData = async (querySearch) => {
  let query = db("meta_data").select("*");

  if (querySearch) {
    query.whereRaw(
      `MATCH(title, norm, namaPasien, doklin_code)
       AGAINST(? IN BOOLEAN MODE)`,
      [`${querySearch}*`]
    );
  }

  return await query;
};

const insert = async (data) => {
  return await db("meta_data").insert({
    ...data,
    created_date: db.raw("UNIX_TIMESTAMP()"),
  });
};
const update = async (id, data) => {
  await db("meta_data").where("id", id).update(data);
  const updated = getDataByID(id);

  return updated;
};
const remove = async (id) => await db("meta_data").where("id", id).delete();

const checkDatabase = async (relativePath) => {
  const result = await db("meta_data")
    .where("file_url", relativePath)
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
  getDataByID,
};
