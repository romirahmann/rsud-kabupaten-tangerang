const db = require("../database/db.config");

const login = async (username) =>
  await db
    .select(
      "u.userId",
      "u.username",
      "u.password",
      "u.roleId",
      "u.fullname",
      "r.roleName",
      "h.hospital_code",
      "h.hospital_name"
    )
    .from("users as u")
    .join("userrole as r", "r.roleId", "u.roleId")
    .innerJoin("hospitals as h", "h.hospital_code", "u.hospital_code")
    .where("username", username);

module.exports = {
  login,
};
