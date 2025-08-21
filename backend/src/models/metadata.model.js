const db = require("./../database/db.config");

const getAll = async (querySearch) => {
  let query = db.select("*").from("meta_data");
  if (querySearch) {
    query.where(function () {
      this.Where("noMr", "like", `${querySearch}%`)
        .orWhere("namaPasien", "like", `${querySearch}%`)
        .orWhere("tglLahir", "like", `${querySearch}%`)
        .orWhere("jenisDokumen", "like", `${querySearch}%`)
        .orWhere("layanan", "like", `${querySearch}%`)
        .orWhere("filename", "like", `${querySearch}%`)
        .orWhere("kategori", "like", `${querySearch}%`);
    });
  }
  return await query;
};

const insert = async (data) => await db("meta_data").insert(data);

module.exports = { getAll, insert };
