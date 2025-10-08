// tools/license.js
const moment = require("moment");
const crypto = require("crypto");
const os = require("os");
const path = require("path");

const SECRET_KEY = crypto
  .createHash("sha256")
  .update(process.env.LICENSE_SECRET)
  .digest();

function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", SECRET_KEY, iv, {
    authTagLength: 16,
  });
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

function decrypt(encryptedBase64) {
  const raw = Buffer.from(encryptedBase64 || "", "base64");
  if (raw.length < 12 + 16) throw new Error("Invalid encrypted data");
  const iv = raw.slice(0, 12);
  const tag = raw.slice(12, 28);
  const ct = raw.slice(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", SECRET_KEY, iv, {
    authTagLength: 16,
  });
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(ct), decipher.final()]);
  return decrypted.toString("utf8");
}

function shortenAttributes(attrs) {
  const dateNow = moment().format("YY-MM-DD");
  const machineId = (attrs.machineId || "").substring(0, 2);
  const mac = (attrs.mac || "").replace(/:/g, "").substring(0, 2);
  const diskSerial = (attrs.diskSerial || "").substring(0, 2);
  const baseboardSerial = (attrs.baseboardSerial || "").substring(0, 2);

  return `inteka-${machineId}-${mac}-${diskSerial}-${baseboardSerial}-${dateNow}`;
}

function getHiddenLicensePath() {
  const appName = "INTEKA";
  let baseDir;

  if (process.platform === "win32") {
    baseDir = path.join(os.homedir(), "AppData", "Roaming");
  } else if (process.platform === "darwin") {
    baseDir = path.join(os.homedir(), "Library", "Application Support");
  } else {
    baseDir = path.join(os.homedir(), ".config");
  }

  return path.join(baseDir, appName, ".license.lic");
}

module.exports = {
  shortenAttributes,
  getHiddenLicensePath,
  encrypt,
  decrypt,
};
