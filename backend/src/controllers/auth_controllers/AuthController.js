const crypto = require("crypto");
const api = require("../../tools/common");
const userModel = require("../../models/auth.model");
const {
  generateToken,
  generateRefreshToken,
  verifyPassword,
  verifyClient,
} = require("../../services/auth.service");

const login = api.catchAsync(async (req, res) => {
  const { username, password, scope = "user_info" } = req.body;
  const { client_id, client_secret, grant_type } = req.query;

  // ✅ Validasi client
  if (!verifyClient(client_id, client_secret)) {
    return api.error(res, "Invalid client credentials", 401);
  }

  // ✅ Validasi grant_type
  if (grant_type !== "password") {
    return api.error(res, "Invalid grant_type, only 'password' allowed", 400);
  }

  // ✅ Validasi username & password
  if (!username || !password) {
    return api.error(res, "username & password required!", 401);
  }

  // Cari user dari DB
  let user;
  try {
    user = await userModel.login(username);
  } catch (err) {
    console.error("DB Error:", err);
    return api.error(res, "Database error", 500);
  }

  if (!user || user.length === 0) {
    return api.error(res, "User Not Found!", 401);
  }

  // Verifikasi password
  const passwordIsMatch = await verifyPassword(password, user[0].password);
  if (!passwordIsMatch) {
    return api.error(res, "Incorrect Password", 401);
  }

  // Data user
  const userData = {
    userId: user[0].userId,
    username: user[0].username,
    fullname: user[0].fullname,
    roleId: user[0].roleId,
    roleName: user[0].roleName,
    hospital_code: user[0].hospital_code,
    hospital_name: user[0].hospital_name,
  };

  // Generate token
  const access_token = generateToken({ ...userData, client_id, scope });
  const refresh_token = generateRefreshToken({ ...userData, client_id, scope });

  const expires_in = 43199; // contoh 12 jam
  const jti = crypto.randomUUID();

  return api.success(res, {
    access_token,
    token_type: "bearer",
    refresh_token,
    expires_in,
    scope,
    default_timezone: "Asia/Jakarta",
    user_id: userData.userId,
    timezone: null,
    hospital_code: userData.hospital_code,
    fullname: userData.fullname,
    hospital_name: userData.hospital_name,
    jti,
    roleId: userData.roleId,
    roleName: userData.roleName,
  });
});

module.exports = { login };
