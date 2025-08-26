const db = require("../database/db.config");

const insert = async (data) => {
  await db("users").insert(data);
};
// READ ALL (dengan optional search)
const getAll = async (querySearch = "") => {
  let query = db("users as u")
    .select("u.*", "ur.roleName")
    .join("userrole as ur", "ur.roleId", "u.roleId"); // pakai roleId

  if (querySearch) {
    query.where(function () {
      this.where("u.username", "like", `%${querySearch}%`)
        .orWhere("ur.roleName", "like", `%${querySearch}%`)
        .orWhere("u.email", "like", `%${querySearch}%`);
    });
  }

  return await query;
};

// READ by ID
const getById = async (id) => {
  return await db("users").where("userId", id).first();
};

// UPDATE
const update = async (id, data) => {
  return await db("users").where("userId", id).update(data).returning("*");
};

// DELETE
const remove = async (id) => {
  return await db("users").where("userId", id).del();
};

module.exports = {
  insert,
  getAll,
  getById,
  update,
  remove,
};
