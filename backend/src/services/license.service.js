// services/license.service.js
const fs = require("fs").promises;
const path = require("path");
const { machineIdSync } = require("node-machine-id");
const si = require("systeminformation");
const mac = require("macaddress");

const {
  shortenAttributes,
  getHiddenLicensePath,
  encrypt,
  decrypt,
} = require("../tools/license");

async function collectSystemAttributes() {
  try {
    const machineId = machineIdSync({ original: true });

    const [macAddr, diskLayout, baseboard] = await Promise.all([
      mac.one(),
      si.diskLayout(),
      si.baseboard(),
    ]);
    const diskSerial = diskLayout?.[0]?.serialNum || "";
    const baseboardSerial = baseboard?.serial || "";
    return shortenAttributes({
      machineId,
      mac: macAddr,
      diskSerial,
      baseboardSerial,
    });
  } catch (err) {
    try {
      const machineId = machineIdSync({ original: true });
      return shortenAttributes({
        machineId,
        mac: "",
        diskSerial: "",
        baseboardSerial: "",
      });
    } catch (e) {
      throw new Error(
        "Failed to collect system attributes: " + (err.message || err)
      );
    }
  }
}

async function saveLicense(serialCode) {
  const filePath = getHiddenLicensePath();
  const dir = path.dirname(filePath);

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, serialCode, "utf8");

  return filePath;
}

async function generateFileLicense(serialCode) {
  const filePath = getHiddenLicensePath();
  const dir = path.dirname(filePath);

  await fs.mkdir(dir, { recursive: true });
  let encrypted = await encrypt(serialCode);
  await fs.writeFile(filePath, encrypted, "utf8");

  return filePath;
}

async function loadLicense() {
  const filePath = getHiddenLicensePath();
  try {
    const encrypted = await fs.readFile(filePath, "utf8");

    if (!encrypted || encrypted.trim() === "") return null;
    const decrypted = decrypt(encrypted);
    return decrypted;
  } catch (err) {
    if (err.code === "ENOENT") return null;

    throw err;
  }
}

async function excitingFileLicense() {
  const filePath = getHiddenLicensePath();

  try {
    await fs.access(filePath);
    console.log("✅ File lisensi ditemukan");
    return true;
  } catch (err) {
    console.log("❌ File lisensi tidak ditemukan");
    return false;
  }
}

module.exports = {
  collectSystemAttributes,
  saveLicense,
  loadLicense,
  excitingFileLicense,
  generateFileLicense,
};
