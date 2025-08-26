const db = require("./../database/db.config");

const getAll = async (querySearch) => {
  let query = db.select("*").from("meta_data");
  return await query;
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
// 🔎 Tambahkan fungsi ini
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
};
