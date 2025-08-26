const argon2 = require("argon2");
const model = require("../../models/users.model");
const api = require("../../tools/common");

// =================== REGISTER ===================
const register = async (req, res) => {
  const newUser = req.body;

  try {
    // hash password sebelum simpan
    newUser.password = await hashPassword(newUser.password);
    let data = await model.insert(newUser);
    return api.success(res, data, "User registered successfully");
  } catch (e) {
    console.error("Error registering user: ", e);
    return api.error(res, "Internal Server Error", 500);
  }
};

// =================== LOGIN ===================
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // cek user ada/tidak
    const user = await model.getByUsername(username);
    if (!user) {
      return api.error(res, "Invalid username or password", 401);
    }

    // verify password
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return api.error(res, "Invalid username or password", 401);
    }

    // bisa tambahin JWT di sini kalau perlu
    return api.success(
      res,
      { id: user.id, username: user.username, roleName: user.roleName },
      "Login successful"
    );
  } catch (e) {
    console.error("Error login: ", e);
    return api.error(res, "Internal Server Error", 500);
  }
};

// =================== GET ALL USERS ===================
const getAllUsers = api.catchAsync(async (req, res) => {
  const querySearch = req.query.search || "";
  let result = await model.getAll(querySearch);
  return api.success(res, result);
});

// =================== GET USER BY ID ===================
const getUserById = api.catchAsync(async (req, res) => {
  const { id } = req.params;
  let result = await model.getById(id);

  if (!result) {
    return api.error(res, "User not found", 404);
  }
  return api.success(res, result);
});

// =================== UPDATE USER ===================
const updateUser = api.catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  // kalau ada password baru, hash dulu
  if (updates.password) {
    updates.password = await hashPassword(updates.password);
  }

  let result = await model.update(id, updates);

  if (!result || result.length === 0) {
    return api.error(res, "User not found or not updated", 404);
  }
  return api.success(res, result, "User updated successfully");
});

// =================== DELETE USER ===================
const deleteUser = api.catchAsync(async (req, res) => {
  const { id } = req.params;
  let result = await model.remove(id);

  if (!result) {
    return api.error(res, "User not found", 404);
  }
  return api.success(res, null, "User deleted successfully");
});

// =================== HASHING PASSWORD ===================
const hashPassword = async (plainPassword) => {
  try {
    const hashedPassword = await argon2.hash(plainPassword, {
      type: argon2.argon2id, // Gunakan Argon2id
      memoryCost: 2 ** 16, // 64MB
      timeCost: 4, // iterasi
      parallelism: 2, // level paralelisme
    });
    return hashedPassword;
  } catch (e) {
    console.error("Error hashing password: ", e);
    throw e;
  }
};

module.exports = {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
