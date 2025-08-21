const db = require("../database/db.config");

const login = async (username) =>
  await db
    .select("u.username", "u.password", "u.roleId", "r.roleName")
    .from("users as u")
    .join("userrole as r", "r.roleId", "u.roleId")
    .where("username", username);

module.exports = {
  login,
};
