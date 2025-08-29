const db = require("./../database/db.config");

const getAll = async () => await db.select("*").from("doklin");
const insert = async (data) => await db("doklin").insert(data);

module.exports = { getAll, insert };
