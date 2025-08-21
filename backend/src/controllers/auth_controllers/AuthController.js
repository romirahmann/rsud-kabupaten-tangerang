const api = require("../../tools/common");
const userModel = require("../../models/auth.model");
const {
  generateToken,
  verifyPassword,
} = require("../../services/auth.service");

const login = api.catchAsync(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return api.error(res, "username & password require!", 401);
  }

  const user = await userModel.login(username);

  if (!user) {
    return api.error(res, "User Not Found!", 401);
  }

  const passwordIsMacth = await verifyPassword(password, user[0].password);

  if (!passwordIsMacth) return await api.error(res, "Incorrect Password", 401);

  const userData = {
    id: user[0].id,
    username: user[0].username,
    roleId: user[0].roleId,
    roleName: user[0].roleName,
  };

  const token = generateToken(userData);

  return api.success(res, { token, user: userData });
});

module.exports = { login };
