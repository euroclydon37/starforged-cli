const os = require("os");
const path = require("path");

const appPath = path.resolve(os.homedir(), "starforged-cli");
const dbPath = path.resolve(appPath, "db.json");

module.exports = { appPath, dbPath };
