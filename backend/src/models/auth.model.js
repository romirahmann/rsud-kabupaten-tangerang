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
    .leftJoin("hospitals as h", "h.hospital_code", "u.hospital_code") // ✅ ubah ke LEFT JOIN
    .where("u.username", username);
module.exports = {
  login,
};
