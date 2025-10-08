const moment = require("moment");
const licenseService = require("../../services/license.service");
const api = require("../../tools/common");

// ✅ fungsi internal (helper) untuk ambil fingerprint
async function getSystemFingerprint() {
  return await licenseService.collectSystemAttributes();
}

const getFingerprint = async (req, res) => {
  try {
    let fingerPrint = await getSystemFingerprint();
    return api.success(res, fingerPrint);
  } catch (error) {
    console.log(error);
    return api.error(res, "Internal Server Error", 500);
  }
};

const activation = async (req, res) => {
  try {
    const { serialNumber } = req.body;

    if (!serialNumber) return api.error(res, "Serial Code Require!", 401);
    await licenseService.saveLicense(serialNumber);
    return api.success(res, "Activation Successfully!");
  } catch (error) {
    console.log(error);
    return api.error(res, "Internal Server Error", 500);
  }
};

const generateLicense = async (req, res) => {
  try {
    const { licenseKey, exp } = req.body;
    const newCode = `${licenseKey},${exp}`;
    await licenseService.generateFileLicense(newCode);

    return api.success(res, "Generate License Successfully!");
  } catch (err) {
    console.log(err.message);
    return api.error(res, "Generate License Failed", 500);
  }
};

const validateLicense = async (req, res) => {
  try {
    // 1️⃣ Cek apakah file lisensi ada
    const licenseFileExists = await licenseService.excitingFileLicense();
    if (!licenseFileExists) {
      return api.error(res, "License not found", 404);
    }

    // 2️⃣ Ambil & decrypt isi lisensi
    let serialNumber;
    try {
      serialNumber = await licenseService.loadLicense(licenseFileExists);
      serialNumber = serialNumber.trim();
      if (!serialNumber || typeof serialNumber !== "string") {
        return api.error(res, "Invalid license data", 400);
      }
    } catch (err) {
      console.error("❌ Failed to load license:", err.message);
      return api.error(res, "License invalid or corrupt", 400);
    }

    // 3️⃣ Ambil fingerprint mesin
    const fingerprint = await getSystemFingerprint();
    const localMachineId = fingerprint.split("-").slice(1, 5).join("-");

    // 4️⃣ Pecah serial license menjadi dua bagian
    const [machineIdFromLicense, expiredAtLicense] = serialNumber.split(",");
    if (!machineIdFromLicense || !expiredAtLicense) {
      return api.error(res, "License format invalid", 400);
    }
    let machineIdLicenseParts = machineIdFromLicense
      .split("-")
      .slice(1, 5)
      .join("-");

    console.log("💻 Local Machine ID:", localMachineId);
    console.log("🔐 License Machine ID:", machineIdLicenseParts);
    console.log("📅 License Expired At:", expiredAtLicense);

    // 5️⃣ Validasi machine ID
    if (localMachineId !== machineIdLicenseParts) {
      return api.error(res, "License not valid for this machine", 401);
    }

    // 6️⃣ Validasi tanggal kadaluarsa
    const now = moment().format("YYYY-MM-DD");
    if (now > moment(expiredAtLicense).format("YYYY-MM-DD")) {
      return api.error(res, "License expired", 401);
    }

    // ✅ Semua valid → return success
    return api.success(res, "License valid");
  } catch (err) {
    console.error("🔥 validateLicense error:", err);
    return api.error(res, "License validation failed", 500);
  }
};

module.exports = {
  generateLicense,
  validateLicense,
  getFingerprint,
  activation,
};
